'''
Business: Get available vehicles from database
Args: event with httpMethod
Returns: HTTP response with list of vehicles
'''
import json
import os
from typing import Dict, Any
import psycopg2

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    database_url = os.environ.get('DATABASE_URL')
    
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT id, model, seats, luggage, base_price, features, is_available
        FROM t_p41600370_minivan_taxi_app.vehicles
        WHERE is_available = true
        ORDER BY base_price ASC
    ''')
    
    rows = cursor.fetchall()
    
    vehicles = []
    for row in rows:
        vehicles.append({
            'id': row[0],
            'model': row[1],
            'seats': row[2],
            'luggage': row[3],
            'price': row[4],
            'features': row[5],
            'is_available': row[6]
        })
    
    cursor.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({'vehicles': vehicles})
    }
