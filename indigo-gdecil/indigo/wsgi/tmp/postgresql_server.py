from daos import UserDAO
from tornado import httpserver, ioloop, options, web, gen
from tornado.escape import json_decode
import json
import momoko


class Application(web.Application):
    def __init__(self):
        handlers = [
            (r"/create-table", PostgresTableHandler),
            (r"/delete-table", PostgresTableHandler),
            (r"/user/(\d+)", PostgresUserHandler),
            (r"/user", PostgresUserHandler)
        ]
        web.Application.__init__(self, handlers)
        dsn = 'dbname=postgres user=postgres password=postgres ' \
              'host=127.0.0.1 port=5433'
        self.db = momoko.Pool(dsn=dsn, size=5)

#         conn_string = "host='127.0.0.1' dbname='postgres' user='postgres' password='postgres'"'

class PostgresHandler(web.RequestHandler):
    SUPPORTED_METHODS = ("GET", "HEAD", "POST", "DELETE", "PATCH", "PUT", "OPTIONS") 
    @gen.coroutine
    def prepare(self):
        if self.request.headers.get("Content-Type") == "application/json":
            try:
                self.json_args = json_decode(self.request.body)
            except Exception as error:
                self.finish('invalid request')

    @property
    def db(self):
        return self.application.db


class PostgresTableHandler(PostgresHandler):

    @gen.coroutine
    def post(self):
        dao = UserDAO(self.db)
        cursor = yield (dao.create_table())
        if not cursor.closed:
            self.write('closing cursor')
            cursor.close()
        self.finish()

    @gen.coroutine
    def delete(self):
        dao = UserDAO(self.db)
        cursor = yield (dao.delete_table())
        if not cursor.closed:
            self.write('closing cursor')
            cursor.close()
        self.finish()


class PostgresUserHandler(PostgresHandler):
    @gen.coroutine
    def get(self, id=None):
        dao = UserDAO(self.db)
        if not id:
            dict_result = yield (dao.get_list())
        else:
            dict_result = yield (dao.get(id))
        self.write(json.dumps(dict_result))
        self.finish()

    @gen.coroutine
    def post(self):
        dao = UserDAO(self.db)
        cursor = yield (dao.create())
        if not cursor.closed:
            self.write('closing cursor')
            cursor.close()
        self.finish()

    @gen.coroutine
    def put(self, id=None):
        if not hasattr(self, 'json_args'):
            self.write('invalid request')
            self.finish()
        else:
            dao = UserDAO(self.db)
            if id:
                result = yield (dao.update(id, data=self.json_args))
                dict_result = yield (dao.get(id))
                self.write(json.dumps(dict_result))
            else:
                self.write('invalid user')
            self.finish()

    @gen.coroutine
    def delete(self, id=None):
        if id:
            dao = UserDAO(self.db)
            result = yield (dao.delete(id))
            self.write('user deleted')
        else:
            self.write('invalid user')
        self.finish()



def main():
    http_server = httpserver.HTTPServer(Application())
    PORT = 8004
    print("serving at port", PORT)
    http_server.listen(PORT)
    ioloop.IOLoop.instance().start()


if __name__ == "__main__":
    main()