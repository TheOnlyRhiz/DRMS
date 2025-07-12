ALTER TABLE "equipment" ADD COLUMN "status" varchar DEFAULT 'available' NOT NULL;--> statement-breakpoint
ALTER TABLE "equipment" DROP COLUMN "category";--> statement-breakpoint
ALTER TABLE "equipment" DROP COLUMN "total_units";--> statement-breakpoint
ALTER TABLE "equipment" DROP COLUMN "available_units";--> statement-breakpoint
ALTER TABLE "equipment" DROP COLUMN "location";--> statement-breakpoint
ALTER TABLE "equipment" DROP COLUMN "specifications";--> statement-breakpoint
ALTER TABLE "equipment" DROP COLUMN "maintenance_schedule";--> statement-breakpoint
ALTER TABLE "equipment" DROP COLUMN "is_active";