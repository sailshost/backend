import { Migration } from '@mikro-orm/migrations';

export class Migration20210315174537 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "container" ("id" varchar(255) not null, "origin" text not null, "name" text not null, "owner_id" text not null);');
    this.addSql('alter table "container" add constraint "container_pkey" primary key ("id");');
  }

}
