from gevent.pywsgi import WSGIServer
import app

http_server = WSGIServer(('', 5000), app.app)
http_server.serve_forever()
