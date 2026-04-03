# -*- coding: utf-8 -*-
"""
NanoClaw HTTP API Client per IronPython (.NET Framework)

Uso:
  client = NanoClawClient("telegram_franky-slicer")
  risposta = client.ask("Che ore sono?")
  print(risposta)
"""

from System.Net import WebRequest, WebException
from System.IO import StreamReader
from System.Text import Encoding

# JSON: prova built-in, poi fallback minimale
try:
    import json
except ImportError:
    class _MinimalJson:
        @staticmethod
        def dumps(obj):
            if isinstance(obj, dict):
                pairs = []
                for k, v in obj.items():
                    pairs.append('"%s": %s' % (k, _MinimalJson.dumps(v)))
                return "{" + ", ".join(pairs) + "}"
            elif isinstance(obj, str):
                return '"%s"' % obj.replace('\\', '\\\\').replace('"', '\\"')
            elif isinstance(obj, bool):
                return "true" if obj else "false"
            elif obj is None:
                return "null"
            else:
                return str(obj)

        @staticmethod
        def loads(s):
            s = s.strip()
            s = s.replace("true", "True").replace("false", "False").replace("null", "None")
            return eval(s)

    json = _MinimalJson()


class NanoClawClient:
    """Client per comunicare con un agente NanoClaw via HTTP API."""

    def __init__(self, group, host="localhost", port=3847,
                 api_key="218bee71db5d61666854eb7600064897"):
        self.group = group
        self.base_url = "http://%s:%d" % (host, port)
        self.api_key = api_key

    def ask(self, text, sender="3DPRN App", timeout=600, poll_interval=5):
        """Invia un messaggio e aspetta la risposta dell'agente."""
        self._drain_responses()

        result = self.send_message(text, sender)
        if not result or not result.get("ok"):
            raise Exception("Invio fallito: %s" % str(result))

        elapsed = 0
        wait = min(poll_interval, 30)
        all_text = []

        while elapsed < timeout:
            responses = self.get_responses(wait_seconds=wait)
            for r in responses:
                all_text.append(r.get("text", ""))

            if all_text:
                extra = self.get_responses(wait_seconds=2)
                for r in extra:
                    all_text.append(r.get("text", ""))
                return "\n".join(all_text)

            elapsed += wait

        return None

    def send_message(self, text, sender="3DPRN App"):
        """Invia un messaggio all'agente senza aspettare la risposta."""
        body = json.dumps({
            "group": self.group,
            "text": text,
            "sender": sender,
        })
        return self._post("/api/message", body)

    def get_responses(self, wait_seconds=10):
        """Recupera le risposte bufferate dall'agente (long-poll)."""
        url = "/api/response?group=%s&wait=%d" % (self.group, wait_seconds)
        timeout_ms = (wait_seconds + 10) * 1000
        result = self._get(url, timeout_ms)
        return result.get("responses", []) if result else []

    def health_check(self):
        """Verifica che NanoClaw sia raggiungibile."""
        try:
            result = self._get("/api/health", timeout_ms=5000)
            return result.get("status") == "ok"
        except Exception:
            return False

    def _drain_responses(self):
        try:
            self.get_responses(wait_seconds=0)
        except Exception:
            pass

    def _post(self, path, body):
        url = self.base_url + path
        req = WebRequest.Create(url)
        req.Method = "POST"
        req.ContentType = "application/json; charset=utf-8"
        req.Timeout = 30000
        if self.api_key:
            req.Headers.Add("Authorization", "Bearer " + self.api_key)

        data = Encoding.UTF8.GetBytes(body)
        req.ContentLength = data.Length

        stream = req.GetRequestStream()
        stream.Write(data, 0, data.Length)
        stream.Close()

        return self._read_response(req)

    def _get(self, path, timeout_ms=30000):
        url = self.base_url + path
        req = WebRequest.Create(url)
        req.Method = "GET"
        req.Timeout = timeout_ms
        if self.api_key:
            req.Headers.Add("Authorization", "Bearer " + self.api_key)

        return self._read_response(req)

    def _read_response(self, req):
        try:
            resp = req.GetResponse()
        except WebException as e:
            if e.Response:
                reader = StreamReader(e.Response.GetResponseStream())
                error_body = reader.ReadToEnd()
                reader.Close()
                raise Exception("HTTP %s: %s" % (
                    e.Response.StatusCode, error_body))
            raise

        reader = StreamReader(resp.GetResponseStream())
        text = reader.ReadToEnd()
        reader.Close()
        resp.Close()

        return json.loads(text)


# ======================================================================
# Test — eseguito direttamente da PythonSCRIPT.Execute()
# ======================================================================

print("=== NanoClaw API Test ===")

try:
    client = NanoClawClient("telegram_franky-slicer")
    print("Client: %s" % client.base_url)

    print("Health check...")
    if not client.health_check():
        print("ERRORE: NanoClaw non raggiungibile")
    else:
        print("OK - connesso")

        print("Invio messaggio...")
        risposta = client.ask("Che ore sono?", sender="3DPRN App")

        if risposta:
            print("Risposta: %s" % risposta)
        else:
            print("Nessuna risposta (timeout)")

except Exception as ex:
    print("ERRORE: %s" % str(ex))
