-- AlterTable
ALTER TABLE `users` ADD COLUMN `twoFactorCode` VARCHAR(255) NULL,
    ADD COLUMN `twoFactorExpires` DATETIME(3) NULL;
