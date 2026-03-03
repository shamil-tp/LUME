# Issue Fix Report: Tus Video Upload Errors

This document explains the root causes and resolutions for two critical errors encountered during the implementation of large video file uploads using the `@tus/server` protocol in a production environment (Frontend on Vercel, Node.js Backend behind an Nginx Reverse Proxy on Ubuntu VPS).

---

## 1. Mixed Content Error (HTTPS to HTTP)

### **The Symptom**
The initial Tus upload request (POST) succeeded over `https://`, but the subsequent chunk requests (PATCH) were blocked by the browser with a Mixed Content error:
> Blocked loading mixed active content "http://api.domain.com/api/uploads/..."

### **The Root Cause**
The frontend was securely communicating via HTTPS, but the Node.js backend was sitting behind an Nginx reverse proxy. Nginx terminated the SSL/HTTPS connection and forwarded the request to the Node.js app internally over standard HTTP (`http://localhost...`). 

Because `@tus/server` natively believed it was running on HTTP, it generated chunk upload URL locations using the `http://` protocol instead of `https://`. When the browser tried to send data back using that `http://` URL, the Same Origin Policy immediately killed the request, as secure HTTPS pages cannot send data to insecure HTTP endpoints.

### **The Fix**
1. **Node.js `@tus/server` Config:** Added `relativeLocation: true` and `respectForwardedHeaders: true`. This tells the Tus server to respect the protocol the proxy observed and use relative paths for location headers, letting the browser reuse the original `https://` origin.
2. **Node.js Express Config:** Added `app.set('trust proxy', 1);` so Express trusts the original `X-Forwarded-*` headers passed by Nginx.
3. **Nginx Config:** Ensured Nginx passes the actual protocol scheme forward using:
   ```nginx
   proxy_set_header X-Forwarded-Proto $scheme;
   proxy_set_header X-Forwarded-Host $host;
   proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
   ```

---

## 2. 413 Payload Too Large (Masked as a CORS Error)

### **The Symptom**
After fixing the Mixed Content error, chunk uploads began failing with what appeared to be a CORS policy error:
> Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource... (Reason: CORS header 'Access-Control-Allow-Origin' missing). Status code: 413.

### **The Root Cause**
This was a false positive CORS error masking a **413 Payload Too Large** error. 

By default, Nginx enforces a strict client request body limit of **1MB**. The application was attempting to push video chunks that were around 7MB in size. 

When Nginx received a chunk larger than 1MB, it immediately blocked the request *before* it ever reached the Node.js backend. Nginx then returned its default generic 413 Error HTML page. Because this default default Nginx page does not contain any CORS headers (`Access-Control-Allow-Origin`), the browser perceived the lack of CORS headers as a CORS rejection, obfuscating the real payload size issue.

### **The Fix**
Increased the allowed upload body size in the Nginx Virtual Host (server block) configuration (`/etc/nginx/sites-available/lume-api`).
```nginx
server {
    server_name api.shamiltp.me;
    
    # Increase maximum upload limit to 5000MB (5GB) to accommodate large video files and chunks
    client_max_body_size 5000M; 
    
    location / { ... }
}
```
After making this change, running `sudo nginx -t` and `sudo systemctl restart nginx` resolved the issue completely. 
