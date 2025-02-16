use tokio::fs;
use axum::{http::StatusCode, response::{IntoResponse, Response}, body::Body};
use log::{debug, info, warn};

pub const CONTENT_DIR: &'static str = "../content/";

pub async fn get_file(path: String) -> Response<Body> {
    debug!("Getting file {path}");

    match fs::read_to_string(path.clone()).await {
        Ok(contents) => {
            Response::new(Body::new(contents))
        }
        Err(_) => {
            info!("Failed to load {path}");
            get_404().await
        }
    }
}
pub async fn get_404() -> Response<Body> {
    match fs::read_to_string(CONTENT_DIR.to_string() + "/not_found/index.html").await {
        Ok(contents) => {
            Response::new(Body::new(contents))
        }
        Err(_) => {
            warn!("Failed to load 404 not found file!");
            (StatusCode::NOT_FOUND, "404 Not Found; Internal Error (404 file unable to be read)").into_response()
        }
    }
}

pub async fn get_route(s: String) -> impl IntoResponse {
    debug!("Routing this path: '{s}'");

    let p = if s.contains(".css") || s.contains(".js") {s.clone()} else {s.clone() + "index.html"};

    match p.split('/').collect::<Vec<&str>>().len() {
        0 => (StatusCode::BAD_REQUEST, "Path must contain '/'").into_response(),
        1 => get_file(CONTENT_DIR.to_string() + "home/" + &p).await,
        _ => get_file(CONTENT_DIR.to_string() + &p).await,
    }
}