import { Migration } from '@mikro-orm/migrations';

export class Migration20210314232104 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "email" text not null default \'\'\'\', "name" text not null default \'\'\'\', "code" text not null default \'\'\'\', "token" text not null default \'\'\'\', "password" text null);');
    this.addSql('alter table "user" add constraint "user_pkey" primary key ("id");');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
  }

}
