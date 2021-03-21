import { Migration } from '@mikro-orm/migrations';

export class Migration20210317014027 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "email" text not null default \'\'\'\', "name" text not null default \'\'\'\', "code" text not null default \'\'\'\', "token" text not null default \'\'\'\', "password" text null, "email_completed" text null);');
    this.addSql('alter table "user" add constraint "user_pkey" primary key ("id");');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');

    this.addSql('create table "container" ("id" varchar(255) not null, "owner_id" varchar(255) null, "origin" text not null, "name" text not null);');
    this.addSql('alter table "container" add constraint "container_pkey" primary key ("id");');

    this.addSql('alter table "container" add constraint "container_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade on delete set null;');
  }

}
