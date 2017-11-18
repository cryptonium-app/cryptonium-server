CREATE TABLE `tb_report` (
  `report_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `coin` varchar(11) DEFAULT NULL,
  `wallet_address` varchar(512) DEFAULT NULL,
  `url` varchar(1024) NOT NULL DEFAULT '',
  `reason` varchar(8096) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`report_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;


CREATE TABLE `tb_scam` (
  `scam_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(128) NOT NULL DEFAULT '',
  `report_id` int(11) DEFAULT NULL,
  `category` varchar(32) NOT NULL DEFAULT '',
  `subcategory` varchar(32) NOT NULL DEFAULT '',
  `coin` varchar(32) DEFAULT NULL,
  `status` tinyint(1) NOT NULL,
  `url` varchar(128) NOT NULL DEFAULT '',
  `wallet_address` varchar(512) DEFAULT '',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`scam_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;