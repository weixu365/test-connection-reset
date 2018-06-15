This repository is for testing **Connection Reset Error** when http keep alive enabled.

Please reference http://theantway.com/2017/11/analyze-connection-reset-error-in-nginx-upstream-with-keep-alive-enabled/ for detailed explanations.

## Steps to reproduce this issue on your local:

### Setup environment
```
npm install
```

### Start the server
```
npm start
```

### Run the testing client in a separate terminal
```
npm run client
```

## Scenarios of receiving RST

The upstream closed the connection after keep-alive timeout (500 ms), the client sends a new http request before it receives and processes the [FIN] package. Because of the connection has been closed from upstream’s perspective, so it send a [RST] response for this request. This would happen in following scenarios:

* Upstream hasn’t send the [FIN] package yet (pending to send package at network layer)
* Upstream has sent the [FIN] package, but client hasn’t received it yet
* Client received the [FIN] package, but hasn’t processed it yet

## Example packages of the second scenario:
```
No.	Time	Source	Destination	Protocol	Length	Info
13	2018-06-15 21:40:00.522110	127.0.0.1	127.0.0.1	TCP	68	50678  >  8000 [SYN] Seq=0 Win=65535 Len=0 MSS=16344 WS=32 TSval=1503957438 TSecr=0 SACK_PERM=1
14	2018-06-15 21:40:00.522210	127.0.0.1	127.0.0.1	TCP	68	8000  >  50678 [SYN, ACK] Seq=0 Ack=1 Win=65535 Len=0 MSS=16344 WS=32 TSval=1503957438 TSecr=1503957438 SACK_PERM=1
15	2018-06-15 21:40:00.522219	127.0.0.1	127.0.0.1	TCP	56	50678  >  8000 [ACK] Seq=1 Ack=1 Win=408288 Len=0 TSval=1503957438 TSecr=1503957438
16	2018-06-15 21:40:00.522228	127.0.0.1	127.0.0.1	TCP	56	[TCP Window Update] 8000  >  50678 [ACK] Seq=1 Ack=1 Win=408288 Len=0 TSval=1503957438 TSecr=1503957438
17	2018-06-15 21:40:00.522315	127.0.0.1	127.0.0.1	HTTP	189	GET / HTTP/1.1 
18	2018-06-15 21:40:00.522358	127.0.0.1	127.0.0.1	TCP	56	8000  >  50678 [ACK] Seq=1 Ack=134 Win=408160 Len=0 TSval=1503957438 TSecr=1503957438
19	2018-06-15 21:40:00.522727	127.0.0.1	127.0.0.1	HTTP	261	HTTP/1.1 200 OK  (text/html)
20	2018-06-15 21:40:00.522773	127.0.0.1	127.0.0.1	TCP	56	50678  >  8000 [ACK] Seq=134 Ack=206 Win=408064 Len=0 TSval=1503957438 TSecr=1503957438
21	2018-06-15 21:40:01.025685	127.0.0.1	127.0.0.1	HTTP	189	GET / HTTP/1.1 
22	2018-06-15 21:40:01.025687	127.0.0.1	127.0.0.1	TCP	56	8000  >  50678 [FIN, ACK] Seq=206 Ack=134 Win=408160 Len=0 TSval=1503957939 TSecr=1503957438
23	2018-06-15 21:40:01.025748	127.0.0.1	127.0.0.1	TCP	44	8000  >  50678 [RST] Seq=206 Win=0 Len=0
24	2018-06-15 21:40:01.025760	127.0.0.1	127.0.0.1	TCP	56	50678  >  8000 [ACK] Seq=267 Ack=207 Win=408064 Len=0 TSval=1503957939 TSecr=1503957939
25	2018-06-15 21:40:01.025769	127.0.0.1	127.0.0.1	TCP	44	8000  >  50678 [RST] Seq=207 Win=0 Len=0
```
