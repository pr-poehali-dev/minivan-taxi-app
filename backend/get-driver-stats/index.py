'''
Business: Get driver statistics including ratings and earnings
Args: event with httpMethod and driver_id in queryStringParameters
Returns: HTTP response with driver stats
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
    
    params = event.get('queryStringParameters', {})
    driver_id = params.get('driver_id')
    
    if not driver_id:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'driver_id is required'})
        }
    
    database_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT name, average_rating, total_ratings
        FROM t_p41600370_minivan_taxi_app.drivers
        WHERE id = %s
    ''', (driver_id,))
    
    driver_row = cursor.fetchone()
    
    if not driver_row:
        cursor.close()
        conn.close()
        return {
            'statusCode': 404,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Driver not found'})
        }
    
    driver_name, avg_rating, total_ratings = driver_row
    
    cursor.execute('''
        SELECT COUNT(*), COALESCE(SUM(price), 0)
        FROM t_p41600370_minivan_taxi_app.orders
        WHERE driver_id = %s AND status = 'completed'
    ''', (driver_id,))
    
    completed_trips, total_earnings = cursor.fetchone()
    
    cursor.execute('''
        SELECT rating, COUNT(*) as count
        FROM t_p41600370_minivan_taxi_app.ratings
        WHERE driver_id = %s
        GROUP BY rating
        ORDER BY rating DESC
    ''', (driver_id,))
    
    rating_distribution = {}
    for rating, count in cursor.fetchall():
        rating_distribution[str(rating)] = count
    
    cursor.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'driver_name': driver_name,
            'average_rating': float(avg_rating) if avg_rating else 0,
            'total_ratings': total_ratings or 0,
            'completed_trips': completed_trips or 0,
            'total_earnings': int(total_earnings) if total_earnings else 0,
            'rating_distribution': rating_distribution
        })
    }
