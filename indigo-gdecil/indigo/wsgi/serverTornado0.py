import tornado.ioloop
import tornado.web

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.write("HW")
        
class WaitHandler(tornado.web.RequestHandler):
    def get(self):
        self.write("pippo")

application = tornado.web.Application([
    (r"/", MainHandler),
    (r"/wait", WaitHandler),
])

if __name__ == "__main__":
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()
            