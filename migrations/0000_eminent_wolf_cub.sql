CREATE TABLE "analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" timestamp NOT NULL,
	"active_users" integer DEFAULT 0,
	"total_logins" integer DEFAULT 0,
	"resources_uploaded" integer DEFAULT 0,
	"resources_downloaded" integer DEFAULT 0,
	"equipment_bookings" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"equipment_id" integer NOT NULL,
	"user_id" varchar NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"purpose" text,
	"status" varchar DEFAULT 'pending' NOT NULL,
	"approved_by" varchar,
	"approved_at" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "downloads" (
	"id" serial PRIMARY KEY NOT NULL,
	"resource_id" integer NOT NULL,
	"user_id" varchar NOT NULL,
	"downloaded_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "equipment" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"category" varchar NOT NULL,
	"total_units" integer DEFAULT 1 NOT NULL,
	"available_units" integer DEFAULT 1 NOT NULL,
	"location" varchar,
	"specifications" jsonb,
	"maintenance_schedule" timestamp,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "resources" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"description" text,
	"file_name" varchar NOT NULL,
	"file_url" varchar NOT NULL,
	"file_size" integer,
	"file_type" varchar NOT NULL,
	"category" varchar NOT NULL,
	"course" varchar NOT NULL,
	"academic_year" varchar,
	"uploaded_by" varchar NOT NULL,
	"download_count" integer DEFAULT 0,
	"is_approved" boolean DEFAULT false,
	"approved_by" varchar,
	"approved_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"email" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"role" varchar DEFAULT 'student' NOT NULL,
	"matric_number" varchar,
	"department" varchar DEFAULT 'Computer Science',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_equipment_id_equipment_id_fk" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "downloads" ADD CONSTRAINT "downloads_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "downloads" ADD CONSTRAINT "downloads_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resources" ADD CONSTRAINT "resources_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resources" ADD CONSTRAINT "resources_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");