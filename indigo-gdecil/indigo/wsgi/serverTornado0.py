import tornado.ioloop
import tornado.web
import time

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        print 20
        self.write("HW")
        
class WaitHandler(tornado.web.RequestHandler):
    @tornado.web.asynchronous
    def get(self):
        print 10
        time.sleep(20)
        print 15
        self.on_response("ugo")
        
    def on_response(self, response):
        print 30
        self.write(response)
        print 40
        self.finish()

application = tornado.web.Application([
    (r"/", MainHandler),
    (r"/wait", WaitHandler),
])

if __name__ == "__main__":
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()
            