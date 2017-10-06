FROM nginx:alpine
                               
COPY build/es5-bundled-server /usr/share/nginx/html/

CMD ["nginx", "-g", "daemon off;"]
