from flask import Flask, request, send_file

app = Flask(__name__)

@app.route('/webhook', methods=['POST'])
def webhook():
    data = request.json
    if 'message' in data and 'text' in data['message']:
        msg = data['message']['text']
        with open("message.txt", "w", encoding='utf-8') as f:
            f.write(msg)
    return '', 200

@app.route('/message.txt', methods=['GET'])
def get_message():
    return send_file("message.txt", mimetype='text/plain')
