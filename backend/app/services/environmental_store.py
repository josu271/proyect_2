from collections import deque, Counter, defaultdict
from datetime import datetime
from threading import Lock


MAX_METRICS = 1000

# Factor educativo aproximado.
# Sirve para estimar CO2 a partir de bytes transferidos.
CO2_GRAMS_PER_BYTE = 0.0000004


class EnvironmentalStore:
    def __init__(self):
        self.metrics = deque(maxlen=MAX_METRICS)
        self.lock = Lock()
        self.counter = 1

    def add_metric(self, method, path, status_code, response_time_ms, response_bytes):
        with self.lock:
            co2_estimated = response_bytes * CO2_GRAMS_PER_BYTE

            metric = {
                "id": self.counter,
                "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "method": method,
                "path": path,
                "status_code": status_code,
                "response_time_ms": response_time_ms,
                "response_bytes": response_bytes,
                "co2_estimated": co2_estimated,
            }

            self.metrics.appendleft(metric)
            self.counter += 1

    def get_paginated_metrics(self, page=1, limit=10):
        page = max(page, 1)
        limit = min(max(limit, 1), 10)

        metrics_list = list(self.metrics)

        start = (page - 1) * limit
        end = start + limit

        return {
            "page": page,
            "limit": limit,
            "total": len(metrics_list),
            "metrics": metrics_list[start:end],
        }

    def get_summary(self):
        metrics_list = list(self.metrics)

        total_requests = len(metrics_list)
        total_bytes = sum(m["response_bytes"] for m in metrics_list)
        total_co2 = sum(m["co2_estimated"] for m in metrics_list)

        avg_co2 = total_co2 / total_requests if total_requests > 0 else 0
        avg_time = (
            sum(m["response_time_ms"] for m in metrics_list) / total_requests
            if total_requests > 0
            else 0
        )

        endpoint_counter = Counter(m["path"] for m in metrics_list)

        bytes_by_endpoint = defaultdict(int)
        for metric in metrics_list:
            bytes_by_endpoint[metric["path"]] += metric["response_bytes"]

        most_used_endpoint = "-"
        if endpoint_counter:
            most_used_endpoint = endpoint_counter.most_common(1)[0][0]

        heaviest_endpoint = "-"
        if bytes_by_endpoint:
            heaviest_endpoint = max(bytes_by_endpoint, key=bytes_by_endpoint.get)

        return {
            "total_requests": total_requests,
            "total_bytes": total_bytes,
            "total_co2": total_co2,
            "avg_co2": avg_co2,
            "avg_response_time": avg_time,
            "most_used_endpoint": most_used_endpoint,
            "heaviest_endpoint": heaviest_endpoint,
        }


environmental_store = EnvironmentalStore()