'''
Business: Rate driver after completed trip
Args: event with httpMethod, body containing rating details
Returns: HTTP response with rating confirmation
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
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    
    order_id = body_data.get('order_id')
    driver_id = body_data.get('driver_id')
    rating = body_data.get('rating')
    comment = body_data.get('comment', '')
    
    if not all([order_id, driver_id, rating]):
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Missing required fields'})
        }
    
    if rating < 1 or rating > 5:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Rating must be between 1 and 5'})
        }
    
    database_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO t_p41600370_minivan_taxi_app.ratings 
        (order_id, driver_id, rating, comment)
        VALUES (%s, %s, %s, %s)
        RETURNING id, created_at
    ''', (order_id, driver_id, rating, comment))
    
    rating_id, created_at = cursor.fetchone()
    
    cursor.execute('''
        SELECT AVG(rating)::DECIMAL(3,2), COUNT(*) 
        FROM t_p41600370_minivan_taxi_app.ratings 
        WHERE driver_id = %s
    ''', (driver_id,))
    
    avg_rating, total_ratings = cursor.fetchone()
    
    cursor.execute('''
        UPDATE t_p41600370_minivan_taxi_app.drivers 
        SET average_rating = %s, total_ratings = %s
        WHERE id = %s
    ''', (avg_rating, total_ratings, driver_id))
    
    conn.commit()
    cursor.close()
    conn.close()
    
    return {
        'statusCode': 201,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'id': rating_id,
            'order_id': order_id,
            'driver_id': driver_id,
            'rating': rating,
            'average_rating': float(avg_rating),
            'total_ratings': total_ratings,
            'created_at': created_at.isoformat()
        })
    }
