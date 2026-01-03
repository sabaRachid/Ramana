import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260102232454 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "ramana_order" ("id" text not null, "status" text not null, "customer" jsonb not null, "items" jsonb not null, "payment_method" text not null, "subtotal" integer not null, "total" integer not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "ramana_order_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_ramana_order_deleted_at" ON "ramana_order" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "ramana_order" cascade;`);
  }

}
