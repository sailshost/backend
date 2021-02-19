// #[macro_use]
extern crate actix_web;
// #[macro_use]
extern crate diesel;

use std::{env, io};

use actix_web::{App, HttpServer, middleware};
use diesel::r2d2::ConnectionManager;
use diesel::PgConnection;
use r2d2::{Pool, PooledConnection};

pub type DBPool = Pool<ConnectionManager<PgConnection>>;
pub type DBPooledConnection = PooledConnection<ConnectionManager<PgConnection>>;

#[actix_web::main]
async fn main() -> io::Result<()> {
	env::set_var("RUST_LOG", "actix_web=debug,actix_server=info");
	env_logger::init();

	let database_url = env::var("DATABASE_URL").expect("DATABASE_URL");
	let manager = ConnectionManager::<PgConnection>::new(database_url);
	let pool = r2d2::Pool::builder().build(manager).expect("Failed to create pool");

	HttpServer::new(move || {
		App::new()
		.data(pool.clone())
		.wrap(middleware::Logger::default())
	})
	.bind("0.0.0.0:1337")?
	.run()
	.await
}

