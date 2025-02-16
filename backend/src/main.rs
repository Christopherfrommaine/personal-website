use axum::{routing::get, Router};

mod custom_routing;
use custom_routing::{get_route, get_404, CONTENT_DIR};

#[allow(unused_imports)]
use log::{debug, info, warn};


#[tokio::main]
async fn main() {
    env_logger::builder().format_file(true).init();
    info!("Starting Main");

    let app = Router::new()

        .route("/not_found/{s}", get(|s: String| get_route(s)))

        .route("/{s}", get(|s: String| get_route(CONTENT_DIR.to_string() + "home/" + &s)))

        // Route 404 Page
        .fallback(|| {info!("Using fallback 404"); get_404()});

    // Run the app on port 8080
    let listener = tokio::net::TcpListener::bind("127.0.0.1:8080")
        .await.unwrap();
    axum::serve(listener, app).await.unwrap();
}