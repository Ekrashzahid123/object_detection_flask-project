from flask import Flask, render_template
import webbrowser

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    port = 5000
    url = f"http://127.0.0.1:{port}/"
    webbrowser.open(url)
    app.run(debug=True, port=port)
