class FakeCursor:
    def __init__(
        self,
        *,
        fetchone_results=None,
        fetchall_results=None,
        execute_side_effect=None,
    ):
        self.fetchone_results = list(fetchone_results or [])
        self.fetchall_results = list(fetchall_results or [])
        self.execute_side_effect = execute_side_effect
        self.execute_calls = []
        self.closed = False

    def execute(self, query, params=None):
        self.execute_calls.append((query, params))

        if self.execute_side_effect is not None:
            self.execute_side_effect(query, params)

    def fetchone(self):
        if self.fetchone_results:
            return self.fetchone_results.pop(0)

        return None

    def fetchall(self):
        if self.fetchall_results:
            return self.fetchall_results.pop(0)

        return []

    def close(self):
        self.closed = True

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        self.close()


class FakeConnection:
    def __init__(self, cursor):
        self._cursor = cursor
        self.closed = False
        self.committed = False
        self.rolled_back = False

    def cursor(self):
        return self._cursor

    def close(self):
        self.closed = True

    def commit(self):
        self.committed = True

    def rollback(self):
        self.rolled_back = True
