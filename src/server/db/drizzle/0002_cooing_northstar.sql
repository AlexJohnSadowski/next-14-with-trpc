ALTER TABLE `todos` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `users` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `todos` MODIFY COLUMN `id` int;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `id` int;