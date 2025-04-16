CREATE TABLE `afk_users` (
  `user_id` bigint NOT NULL,
  `guild_id` bigint NOT NULL,
  `status` text,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`guild_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `antinuke_admins` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `guild_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_guild_user` (`guild_id`,`user_id`),
  KEY `idx_guild` (`guild_id`),
  KEY `idx_user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `antinuke_incidents` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `guild_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `type` varchar(50) NOT NULL,
  `action_count` int NOT NULL DEFAULT '1',
  `first_action_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_action_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `punishment_applied` tinyint(1) DEFAULT '0',
  `punishment_type` varchar(20) DEFAULT NULL,
  `punishment_duration` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_guild` (`guild_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_type` (`type`),
  KEY `idx_time` (`last_action_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `antinuke_settings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `guild_id` bigint NOT NULL,
  `type` varchar(50) NOT NULL,
  `enabled` tinyint(1) DEFAULT '1',
  `threshold_count` int NOT NULL DEFAULT '0',
  `threshold_time` int NOT NULL DEFAULT '60',
  `punishment_type` varchar(20) NOT NULL DEFAULT 'ban',
  `punishment_duration` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_guild_type` (`guild_id`,`type`),
  KEY `idx_guild` (`guild_id`),
  KEY `idx_type` (`type`),
  KEY `idx_enabled` (`enabled`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `antinuke_whitelist` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `guild_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_guild_user` (`guild_id`,`user_id`),
  KEY `idx_guild` (`guild_id`),
  KEY `idx_user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `antiraid_admins` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `guild_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `added_by` bigint NOT NULL,
  `added_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_guild_user` (`guild_id`,`user_id`),
  KEY `idx_guild` (`guild_id`),
  KEY `idx_user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `antiraid_incidents` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `guild_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `type` varchar(50) NOT NULL,
  `action_count` int NOT NULL DEFAULT '1',
  `first_action_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_action_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `punishment_applied` tinyint(1) DEFAULT '0',
  `punishment_type` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_guild` (`guild_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_type` (`type`),
  KEY `idx_time` (`last_action_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `antiraid_modules` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `guild_id` bigint NOT NULL,
  `type` varchar(50) NOT NULL,
  `enabled` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_guild_type` (`guild_id`,`type`),
  KEY `idx_guild` (`guild_id`),
  KEY `idx_type` (`type`),
  KEY `idx_enabled` (`enabled`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `antiraid_settings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `guild_id` bigint NOT NULL,
  `type` varchar(50) NOT NULL,
  `enabled` tinyint(1) NOT NULL DEFAULT '0',
  `value` varchar(255) DEFAULT NULL,
  `threshold_time` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_guild_type` (`guild_id`,`type`),
  KEY `idx_guild` (`guild_id`),
  KEY `idx_type` (`type`),
  KEY `idx_enabled` (`enabled`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `antiraid_whitelist` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `guild_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `added_by` bigint NOT NULL,
  `added_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_guild_user` (`guild_id`,`user_id`),
  KEY `idx_guild` (`guild_id`),
  KEY `idx_user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `autoresponders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `guild_id` bigint NOT NULL,
  `trigger_word` varchar(100) NOT NULL,
  `response` text NOT NULL,
  `created_by` bigint NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `guild_trigger` (`guild_id`,`trigger_word`),
  KEY `created_at` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `autorole_settings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `guild_id` bigint NOT NULL,
  `enabled` tinyint(1) NOT NULL DEFAULT '0',
  `roles` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `guild_id` (`guild_id`),
  KEY `idx_guild` (`guild_id`),
  KEY `idx_enabled` (`enabled`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `birthday_settings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `guild_id` bigint NOT NULL,
  `channel_id` bigint DEFAULT NULL,
  `role_id` bigint DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_guild` (`guild_id`),
  KEY `idx_guild` (`guild_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `birthdays` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `birthday` date NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user` (`user_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_birthday` (`birthday`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `button_role_buttons` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `button_role_id` bigint NOT NULL,
  `button_label` varchar(100) NOT NULL,
  `role_id` bigint NOT NULL,
  `button_style` varchar(20) NOT NULL DEFAULT 'primary',
  `emoji` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_button_role` (`button_role_id`),
  KEY `idx_role` (`role_id`),
  CONSTRAINT `button_role_buttons_ibfk_1` FOREIGN KEY (`button_role_id`) REFERENCES `button_roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `button_role_restrictions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `button_role_id` bigint NOT NULL,
  `role_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `button_role_id` (`button_role_id`),
  CONSTRAINT `button_role_restrictions_ibfk_1` FOREIGN KEY (`button_role_id`) REFERENCES `button_roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `button_roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `guild_id` bigint NOT NULL,
  `message_id` bigint DEFAULT NULL,
  `channel_id` bigint NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `enabled` tinyint(1) NOT NULL DEFAULT '1',
  `allowed_roles` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `usage_limit` int DEFAULT NULL,
  `current_uses` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_guild` (`guild_id`),
  KEY `idx_message` (`message_id`),
  KEY `idx_enabled` (`enabled`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `command_aliases` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `guild_id` bigint NOT NULL,
  `creator_id` bigint NOT NULL,
  `alias_name` varchar(50) NOT NULL,
  `command_string` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_guild_alias` (`guild_id`,`alias_name`),
  KEY `idx_guild` (`guild_id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `command_restrictions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `guild_id` bigint NOT NULL,
  `command_name` varchar(100) NOT NULL,
  `role_id` bigint NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_command_role` (`guild_id`,`command_name`,`role_id`),
  KEY `idx_guild` (`guild_id`),
  KEY `idx_command` (`command_name`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `define_filter` (
  `guild_id` bigint NOT NULL,
  `filter_enabled` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`guild_id`),
  KEY `idx_guild` (`guild_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `developers` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `added_by` bigint NOT NULL,
  `added_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user` (`user_id`),
  KEY `idx_user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `economy` (
  `user_id` bigint NOT NULL,
  `wallet` bigint NOT NULL DEFAULT '0',
  `bank` bigint NOT NULL DEFAULT '0',
  `last_daily` timestamp NULL DEFAULT NULL,
  `last_work` timestamp NULL DEFAULT NULL,
  `last_steal` timestamp NULL DEFAULT NULL,
  `last_interest` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  KEY `idx_wallet` (`wallet`),
  KEY `idx_bank` (`bank`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `economy_inventory` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `item_id` bigint NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_item` (`user_id`,`item_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_item` (`item_id`),
  CONSTRAINT `economy_inventory_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `economy_shop` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `economy_jobs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `min_pay` bigint NOT NULL,
  `max_pay` bigint NOT NULL,
  `created_by` bigint NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_job_name` (`name`),
  KEY `idx_creator` (`created_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `economy_settings` (
  `guild_id` bigint NOT NULL,
  `currency_name` varchar(50) NOT NULL DEFAULT 'coins',
  `currency_symbol` varchar(10) NOT NULL DEFAULT 0xF09F92B0,
  `daily_amount` bigint NOT NULL DEFAULT '100',
  `work_cooldown` int NOT NULL DEFAULT '3600',
  `steal_cooldown` int NOT NULL DEFAULT '7200',
  `steal_chance` float NOT NULL DEFAULT '0.3',
  `steal_max_percent` float NOT NULL DEFAULT '0.3',
  `bank_interest` float NOT NULL DEFAULT '0.05',
  `bank_interest_interval` int NOT NULL DEFAULT '86400',
  `min_bet` bigint NOT NULL DEFAULT '10',
  `max_bet` bigint NOT NULL DEFAULT '10000',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`guild_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `economy_shop` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `price` bigint NOT NULL,
  `stock` int NOT NULL DEFAULT '-1',
  `created_by` bigint NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_creator` (`created_by`),
  KEY `idx_price` (`price`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `economy_transactions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `from_user` bigint NOT NULL,
  `to_user` bigint NOT NULL,
  `amount` bigint NOT NULL,
  `type` varchar(20) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_from_user` (`from_user`),
  KEY `idx_to_user` (`to_user`),
  KEY `idx_type` (`type`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `edit_messages` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `guild_id` bigint NOT NULL,
  `channel_id` bigint NOT NULL,
  `message_id` bigint NOT NULL,
  `author_id` bigint NOT NULL,
  `old_content` text,
  `new_content` text,
  `attachment_urls` text,
  `edited_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_message` (`guild_id`,`channel_id`,`message_id`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `gambling_cooldowns` (
  `user_id` bigint NOT NULL,
  `guild_id` bigint NOT NULL,
  `last_gamble` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`,`guild_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_guild` (`guild_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `gambling_history` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `guild_id` bigint NOT NULL,
  `game` varchar(50) NOT NULL,
  `game_type` varchar(50) NOT NULL,
  `bet_amount` bigint NOT NULL,
  `win_amount` bigint NOT NULL,
  `multiplier` float DEFAULT NULL,
  `is_jackpot` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_guild` (`guild_id`),
  KEY `idx_game` (`game_type`),
  KEY `idx_created` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `gambling_settings` (
  `guild_id` bigint NOT NULL,
  `enabled` tinyint(1) DEFAULT '1',
  `min_bet` bigint DEFAULT '10',
  `max_bet` bigint DEFAULT '10000',
  `cooldown` int NOT NULL DEFAULT '60',
  `house_edge` float DEFAULT '0.05',
  `jackpot_chance` float DEFAULT '0.001',
  `jackpot_multiplier` float DEFAULT '100',
  `max_win_multiplier` float DEFAULT '10',
  `cooldown_seconds` int DEFAULT '60',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`guild_id`),
  KEY `idx_guild` (`guild_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `gambling_stats` (
  `user_id` bigint NOT NULL,
  `guild_id` bigint NOT NULL,
  `total_bets` bigint DEFAULT '0',
  `total_wins` bigint DEFAULT '0',
  `total_losses` bigint DEFAULT '0',
  `total_wagered` bigint DEFAULT '0',
  `total_won` bigint DEFAULT '0',
  `total_lost` bigint DEFAULT '0',
  `biggest_win` bigint DEFAULT '0',
  `biggest_loss` bigint DEFAULT '0',
  `jackpots_won` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`guild_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_guild` (`guild_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `giveaway_bonus_roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `guild_id` bigint NOT NULL,
  `role_id` bigint NOT NULL,
  `bonus_entries` int NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_guild_role` (`guild_id`,`role_id`),
  KEY `idx_guild` (`guild_id`),
  KEY `idx_role` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `giveaway_entries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `giveaway_id` int NOT NULL,
  `user_id` bigint NOT NULL,
  `joined_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `entries` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_entry` (`giveaway_id`,`user_id`),
  KEY `idx_giveaway` (`giveaway_id`),
  KEY `idx_user` (`user_id`),
  CONSTRAINT `giveaway_entries_ibfk_1` FOREIGN KEY (`giveaway_id`) REFERENCES `giveaways` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `giveaway_winners` (
  `id` int NOT NULL AUTO_INCREMENT,
  `giveaway_id` int NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_winner` (`giveaway_id`,`user_id`),
  KEY `idx_giveaway` (`giveaway_id`),
  KEY `idx_user` (`user_id`),
  CONSTRAINT `giveaway_winners_ibfk_1` FOREIGN KEY (`giveaway_id`) REFERENCES `giveaways` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `giveaways` (
  `id` int NOT NULL AUTO_INCREMENT,
  `guild_id` bigint NOT NULL,
  `channel_id` bigint NOT NULL,
  `message_id` bigint NOT NULL,
  `host_id` bigint NOT NULL,
  `prize` varchar(100) NOT NULL,
  `description` text,
  `winners` int NOT NULL DEFAULT '1',
  `end_time` datetime NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_guild` (`guild_id`),
  KEY `idx_status` (`status`),
  KEY `idx_end_time` (`end_time`),
  KEY `idx_host` (`host_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `guild_settings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `guild_id` bigint NOT NULL,
  `prefix` varchar(10) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `antinuke_log_channel` bigint DEFAULT NULL,
  `joins_disabled` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `guild_id` (`guild_id`),
  KEY `idx_guild` (`guild_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `hardbans` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `guild_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `moderator_id` bigint NOT NULL,
  `reason` text NOT NULL,
  `banned_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_guild_user` (`guild_id`,`user_id`),
  KEY `idx_guild` (`guild_id`),
  KEY `idx_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `highlights` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `guild_id` bigint NOT NULL,
  `word` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_highlight` (`user_id`,`guild_id`,`word`),
  KEY `idx_user` (`user_id`),
  KEY `idx_guild` (`guild_id`),
  KEY `idx_word` (`word`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `jail_config` (
  `guild_id` bigint NOT NULL,
  `role_id` bigint NOT NULL,
  `channel_id` bigint NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`guild_id`),
  KEY `idx_guild` (`guild_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `jailed_users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `guild_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `roles` text NOT NULL,
  `jailed_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_guild_user` (`guild_id`,`user_id`),
  KEY `idx_guild` (`guild_id`),
  KEY `idx_user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `joins_whitelist` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `guild_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `added_by` bigint NOT NULL,
  `added_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_guild_user` (`guild_id`,`user_id`),
  KEY `idx_guild` (`guild_id`),
  KEY `idx_user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `kick_notifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `guild_id` bigint NOT NULL,
  `channel_id` bigint NOT NULL,
  `streamer` varchar(255) NOT NULL,
  `message` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_guild` (`guild_id`),
  KEY `idx_streamer` (`streamer`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `kick_streams` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `streamer` varchar(255) NOT NULL,
  `is_live` tinyint(1) DEFAULT '0',
  `category` varchar(255) DEFAULT NULL,
  `title` text,
  `started_at` timestamp NULL DEFAULT NULL,
  `last_checked` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_streamer` (`streamer`),
  KEY `idx_is_live` (`is_live`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `lastfm_custom_commands` (
  `user_id` bigint NOT NULL,
  `command_text` varchar(50) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `lastfm_users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `discord_id` bigint NOT NULL,
  `lastfm_username` varchar(255) NOT NULL,
  `session_key` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `discord_id` (`discord_id`),
  KEY `idx_discord_id` (`discord_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `leveling_ignored_channels` (
  `guild_id` bigint NOT NULL,
  `channel_id` bigint NOT NULL,
  PRIMARY KEY (`guild_id`,`channel_id`),
  CONSTRAINT `leveling_ignored_channels_ibfk_1` FOREIGN KEY (`guild_id`) REFERENCES `leveling_settings` (`guild_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `leveling_ignored_roles` (
  `guild_id` bigint NOT NULL,
  `role_id` bigint NOT NULL,
  PRIMARY KEY (`guild_id`,`role_id`),
  CONSTRAINT `leveling_ignored_roles_ibfk_1` FOREIGN KEY (`guild_id`) REFERENCES `leveling_settings` (`guild_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `leveling_role_rewards` (
  `guild_id` bigint NOT NULL,
  `level` int NOT NULL,
  `role_id` bigint NOT NULL,
  PRIMARY KEY (`guild_id`,`level`),
  CONSTRAINT `leveling_role_rewards_ibfk_1` FOREIGN KEY (`guild_id`) REFERENCES `leveling_settings` (`guild_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `leveling_settings` (
  `guild_id` bigint NOT NULL,
  `enabled` tinyint(1) DEFAULT '1',
  `announcement_channel_id` bigint DEFAULT NULL,
  `levelup_message` text,
  `xp_rate_min` int DEFAULT '15',
  `xp_rate_max` int DEFAULT '25',
  `cooldown_seconds` int DEFAULT '60',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`guild_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `lock_ignored_channels` (
  `guild_id` bigint NOT NULL,
  `channel_id` bigint NOT NULL,
  PRIMARY KEY (`guild_id`,`channel_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `lock_roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `guild_id` bigint NOT NULL,
  `role_id` bigint NOT NULL,
  `role_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_guild_role` (`guild_id`,`role_id`),
  KEY `idx_guild` (`guild_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `lockdown_roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `guild_id` bigint NOT NULL,
  `role_id` bigint NOT NULL,
  `role_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_guild_role` (`guild_id`,`role_id`),
  KEY `idx_guild` (`guild_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `member_notes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `guild_id` bigint NOT NULL,
  `member_id` bigint NOT NULL,
  `moderator_id` bigint NOT NULL,
  `note` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `guild_member_idx` (`guild_id`,`member_id`),
  KEY `idx_moderator` (`moderator_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `moderation_history` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `moderator_id` bigint NOT NULL,
  `action_type` varchar(20) NOT NULL,
  `target_id` bigint NOT NULL,
  `guild_id` bigint NOT NULL,
  `reason` text,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `message_id` bigint DEFAULT NULL,
  `channel_id` bigint DEFAULT NULL,
  `duration` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_moderator` (`moderator_id`),
  KEY `idx_target` (`target_id`),
  KEY `idx_guild` (`guild_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `nickname_locks` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `guild_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `locked_nickname` varchar(32) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_guild_user` (`guild_id`,`user_id`),
  KEY `idx_guild` (`guild_id`),
  KEY `idx_user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `punishment_history` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `guild_id` bigint NOT NULL,
  `action_type` varchar(20) NOT NULL,
  `moderator_id` bigint NOT NULL,
  `reason` text,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `duration` bigint DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_guild` (`guild_id`),
  KEY `idx_moderator` (`moderator_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `reaction_messages` (
  `guild_id` bigint NOT NULL,
  `channel_id` bigint NOT NULL,
  `message_id` bigint NOT NULL,
  `author_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `emoji` varchar(255) NOT NULL,
  `removed_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`guild_id`,`channel_id`,`message_id`,`user_id`,`emoji`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `reaction_role_reactions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `reaction_role_id` bigint NOT NULL,
  `emoji` varchar(255) NOT NULL,
  `role_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_reaction` (`reaction_role_id`,`emoji`),
  CONSTRAINT `reaction_role_reactions_ibfk_1` FOREIGN KEY (`reaction_role_id`) REFERENCES `reaction_roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `reaction_role_restrictions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `reaction_role_id` bigint NOT NULL,
  `role_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_restriction` (`reaction_role_id`,`role_id`),
  CONSTRAINT `reaction_role_restrictions_ibfk_1` FOREIGN KEY (`reaction_role_id`) REFERENCES `reaction_roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `reaction_roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `guild_id` bigint NOT NULL,
  `message_id` bigint NOT NULL,
  `channel_id` bigint NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `enabled` tinyint(1) DEFAULT '1',
  `usage_limit` int DEFAULT NULL,
  `current_uses` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_message` (`message_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `reddit_notifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `guild_id` bigint NOT NULL,
  `channel_id` bigint NOT NULL,
  `subreddit` varchar(255) NOT NULL,
  `post_type` enum('new','hot','rising','top') NOT NULL DEFAULT 'new',
  `message` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_guild` (`guild_id`),
  KEY `idx_subreddit` (`subreddit`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `reddit_posts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `post_id` varchar(255) NOT NULL,
  `subreddit` varchar(255) NOT NULL,
  `title` text,
  `published_at` timestamp NULL DEFAULT NULL,
  `last_checked` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_post` (`post_id`),
  KEY `idx_subreddit` (`subreddit`),
  KEY `idx_published` (`published_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `reminders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `guild_id` bigint NOT NULL,
  `channel_id` bigint NOT NULL,
  `reminder_text` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `remind_at` timestamp NOT NULL,
  `completed` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_guild` (`guild_id`),
  KEY `idx_remind_at` (`remind_at`),
  KEY `idx_completed` (`completed`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `roleplay_stats` (
  `user_id` bigint NOT NULL,
  `action` varchar(50) NOT NULL,
  `count` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`user_id`,`action`),
  KEY `idx_user` (`user_id`),
  KEY `idx_action` (`action`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `snipe_messages` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `guild_id` bigint NOT NULL,
  `channel_id` bigint NOT NULL,
  `message_id` bigint NOT NULL,
  `author_id` bigint NOT NULL,
  `content` text,
  `attachment_urls` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_message` (`guild_id`,`channel_id`,`message_id`)
) ENGINE=InnoDB AUTO_INCREMENT=111 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `soundcloud_notifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `guild_id` bigint NOT NULL,
  `channel_id` bigint NOT NULL,
  `artist_id` varchar(255) NOT NULL,
  `message` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_guild` (`guild_id`),
  KEY `idx_artist` (`artist_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `soundcloud_tracks` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `track_id` varchar(255) NOT NULL,
  `artist_id` varchar(255) NOT NULL,
  `title` text,
  `published_at` timestamp NULL DEFAULT NULL,
  `last_checked` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_track` (`track_id`),
  KEY `idx_artist` (`artist_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `spotify_tokens` (
  `user_id` varchar(255) NOT NULL,
  `access_token` text NOT NULL,
  `refresh_token` text NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `starboard_ignored_channels` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `guild_id` bigint NOT NULL,
  `channel_id` bigint NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_channel` (`guild_id`,`channel_id`),
  KEY `idx_guild` (`guild_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `starboard_ignored_roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `guild_id` bigint NOT NULL,
  `role_id` bigint NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_role` (`guild_id`,`role_id`),
  KEY `idx_guild` (`guild_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `starboard_ignored_users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `guild_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user` (`guild_id`,`user_id`),
  KEY `idx_guild` (`guild_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `starboard_messages` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `guild_id` bigint NOT NULL,
  `original_message_id` bigint NOT NULL,
  `starboard_message_id` bigint NOT NULL,
  `author_id` bigint NOT NULL,
  `star_count` int NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_message` (`guild_id`,`original_message_id`),
  KEY `idx_guild` (`guild_id`),
  KEY `idx_author` (`author_id`),
  KEY `idx_star_count` (`star_count`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `starboard_reactions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `guild_id` bigint NOT NULL,
  `message_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_reaction` (`guild_id`,`message_id`,`user_id`),
  KEY `idx_guild` (`guild_id`),
  KEY `idx_message` (`message_id`),
  KEY `idx_user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `starboard_settings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `guild_id` bigint NOT NULL,
  `channel_id` bigint NOT NULL,
  `emoji` varchar(50) NOT NULL DEFAULT '⭐',
  `threshold` int NOT NULL DEFAULT '5',
  `self_star` tinyint(1) NOT NULL DEFAULT '0',
  `allow_bots` tinyint(1) NOT NULL DEFAULT '0',
  `allow_nsfw` tinyint(1) NOT NULL DEFAULT '0',
  `require_image` tinyint(1) NOT NULL DEFAULT '0',
  `min_chars` int NOT NULL DEFAULT '0',
  `max_chars` int NOT NULL DEFAULT '2000',
  `blacklisted_channels` text,
  `blacklisted_roles` text,
  `blacklisted_users` text,
  `whitelisted_channels` text,
  `whitelisted_roles` text,
  `whitelisted_users` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `guild_id` (`guild_id`),
  KEY `idx_guild` (`guild_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `starboard_whitelisted_channels` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `guild_id` bigint NOT NULL,
  `channel_id` bigint NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_channel` (`guild_id`,`channel_id`),
  KEY `idx_guild` (`guild_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `starboard_whitelisted_roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `guild_id` bigint NOT NULL,
  `role_id` bigint NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_role` (`guild_id`,`role_id`),
  KEY `idx_guild` (`guild_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `starboard_whitelisted_users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `guild_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user` (`guild_id`,`user_id`),
  KEY `idx_guild` (`guild_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `temp_roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `guild_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `role_id` bigint NOT NULL,
  `moderator_id` bigint NOT NULL,
  `expires_at` bigint NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_guild_user_role` (`guild_id`,`user_id`,`role_id`),
  KEY `idx_guild` (`guild_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_expires` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tiktok_notifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `guild_id` bigint NOT NULL,
  `channel_id` bigint NOT NULL,
  `username` varchar(255) NOT NULL,
  `message` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_guild` (`guild_id`),
  KEY `idx_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tiktok_videos` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `video_id` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `description` text,
  `published_at` timestamp NULL DEFAULT NULL,
  `last_checked` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_video` (`video_id`),
  KEY `idx_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `timezones` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `timezone` varchar(50) NOT NULL,
  `city` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user` (`user_id`),
  KEY `idx_user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `twitch_notifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `guild_id` bigint NOT NULL,
  `channel_id` bigint NOT NULL,
  `streamer` varchar(255) NOT NULL,
  `message` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_guild` (`guild_id`),
  KEY `idx_streamer` (`streamer`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `twitch_streams` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `streamer` varchar(255) NOT NULL,
  `is_live` tinyint(1) DEFAULT '0',
  `game` varchar(255) DEFAULT NULL,
  `title` text,
  `started_at` timestamp NULL DEFAULT NULL,
  `last_checked` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_streamer` (`streamer`),
  KEY `idx_is_live` (`is_live`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `unjail_roles` (
  `guild_id` bigint NOT NULL,
  `roles` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`guild_id`),
  KEY `idx_guild` (`guild_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `urban_filter` (
  `guild_id` bigint NOT NULL,
  `filter_enabled` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`guild_id`),
  KEY `idx_guild` (`guild_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `user_levels` (
  `user_id` bigint NOT NULL,
  `guild_id` bigint NOT NULL,
  `xp` bigint DEFAULT '0',
  `level` int DEFAULT '0',
  `last_message_time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`,`guild_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `verification_settings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `guild_id` bigint NOT NULL,
  `type` enum('simple','complex') NOT NULL,
  `verify_channel_id` bigint NOT NULL,
  `unverified_role_id` bigint NOT NULL,
  `member_roles` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `guild_id` (`guild_id`),
  KEY `idx_guild` (`guild_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `voicemaster_channels` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `guild_id` bigint NOT NULL,
  `channel_id` bigint NOT NULL,
  `owner_id` bigint NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_channel` (`guild_id`,`channel_id`),
  KEY `idx_guild` (`guild_id`),
  KEY `idx_owner` (`owner_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `voicemaster_settings` (
  `guild_id` bigint NOT NULL,
  `category_id` bigint NOT NULL,
  `join_channel_id` bigint NOT NULL,
  `interface_channel_id` bigint NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`guild_id`),
  KEY `idx_guild` (`guild_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `watched_threads` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `guild_id` bigint NOT NULL,
  `thread_id` bigint NOT NULL,
  `thread_name` varchar(100) NOT NULL,
  `watched_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_thread` (`guild_id`,`thread_id`),
  KEY `idx_guild` (`guild_id`),
  KEY `idx_thread` (`thread_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `youtube_notifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `guild_id` bigint NOT NULL,
  `channel_id` bigint NOT NULL,
  `youtube_channel_id` varchar(255) NOT NULL,
  `message` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_guild` (`guild_id`),
  KEY `idx_youtube_channel` (`youtube_channel_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `youtube_videos` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `video_id` varchar(255) NOT NULL,
  `youtube_channel_id` varchar(255) NOT NULL,
  `title` text,
  `published_at` timestamp NULL DEFAULT NULL,
  `last_checked` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_video` (`video_id`),
  KEY `idx_channel` (`youtube_channel_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

