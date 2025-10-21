'''
Business: Create new order for minivan taxi service
Args: event with httpMethod, body containing order details
Returns: HTTP response with order data or error
'''
import json
import os
from datetime import datetime
from typing import Dict, Any
import psycopg2

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
    
    from_location = body_data.get('from_location')
    to_location = body_data.get('to_location')
    trip_type = body_data.get('trip_type')
    vehicle_id = body_data.get('vehicle_id')
    vehicle_model = body_data.get('vehicle_model')
    price = body_data.get('price')
    customer_name = body_data.get('customer_name', 'Гость')
    customer_phone = body_data.get('customer_phone', '')
    payment_method = body_data.get('payment_method')
    
    if not all([from_location, to_location, trip_type, vehicle_model, price]):
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Missing required fields'})
        }
    
    database_url = os.environ.get('DATABASE_URL')
    
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor()
    
    order_number = f"VR-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
    
    insert_query = '''
        INSERT INTO t_p41600370_minivan_taxi_app.orders 
        (order_number, from_location, to_location, trip_type, vehicle_id, vehicle_model, 
         price, payment_method, status, customer_name, customer_phone)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id, order_number, created_at
    '''
    
    cursor.execute(insert_query, (
        order_number, from_location, to_location, trip_type, vehicle_id, vehicle_model,
        price, payment_method, 'new', customer_name, customer_phone
    ))
    
    result = cursor.fetchone()
    order_id, order_num, created_at = result
    
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
            'id': order_id,
            'order_number': order_num,
            'from_location': from_location,
            'to_location': to_location,
            'trip_type': trip_type,
            'vehicle_model': vehicle_model,
            'price': price,
            'status': 'new',
            'created_at': created_at.isoformat(),
            'customer_name': customer_name
        })
    }
