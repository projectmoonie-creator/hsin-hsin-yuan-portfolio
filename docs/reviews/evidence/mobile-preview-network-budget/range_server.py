#!/usr/bin/env python3
"""Serve the frozen dist tree with single-range HTTP support."""

import argparse
import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class RangeRequestHandler(SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def __init__(self, *args, directory=None, **kwargs):
        self._range = None
        super().__init__(*args, directory=directory, **kwargs)

    def log_message(self, _format, *_args):
        return

    def send_head(self):
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            return super().send_head()
        try:
            source = open(path, "rb")
        except OSError:
            self.send_error(404, "File not found")
            return None

        file_size = os.fstat(source.fileno()).st_size
        content_type = self.guess_type(path)
        range_header = self.headers.get("Range")
        start = 0
        end = file_size - 1
        status = 200

        if range_header and range_header.startswith("bytes="):
            spec = range_header.removeprefix("bytes=").split(",", 1)[0].strip()
            start_text, end_text = spec.split("-", 1)
            try:
                if start_text:
                    start = int(start_text)
                    end = int(end_text) if end_text else end
                else:
                    suffix = int(end_text)
                    start = max(0, file_size - suffix)
            except ValueError:
                source.close()
                self.send_error(416, "Invalid range")
                return None
            if start >= file_size or start < 0:
                source.close()
                self.send_response(416)
                self.send_header("Content-Range", f"bytes */{file_size}")
                self.send_header("Content-Length", "0")
                self.end_headers()
                return None
            end = min(end, file_size - 1)
            status = 206

        self._range = (start, end)
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Cache-Control", "no-store")
        if status == 206:
            self.send_header("Content-Range", f"bytes {start}-{end}/{file_size}")
        self.send_header("Content-Length", str(end - start + 1))
        self.send_header("Last-Modified", self.date_time_string(os.fstat(source.fileno()).st_mtime))
        self.end_headers()
        source.seek(start)
        return source

    def copyfile(self, source, outputfile):
        start, end = self._range or (0, os.fstat(source.fileno()).st_size - 1)
        remaining = end - start + 1
        while remaining > 0:
            chunk = source.read(min(64 * 1024, remaining))
            if not chunk:
                break
            try:
                outputfile.write(chunk)
            except (BrokenPipeError, ConnectionResetError):
                break
            remaining -= len(chunk)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--directory", required=True)
    parser.add_argument("--port", type=int, required=True)
    args = parser.parse_args()
    server = ThreadingHTTPServer(
        ("127.0.0.1", args.port),
        lambda *handler_args, **handler_kwargs: RangeRequestHandler(
            *handler_args,
            directory=args.directory,
            **handler_kwargs,
        ),
    )
    print(f"Serving {args.directory} at http://127.0.0.1:{args.port}", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    main()
