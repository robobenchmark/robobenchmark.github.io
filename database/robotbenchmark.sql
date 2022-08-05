CREATE TABLE `benchmark` (
  `id` int(11) NOT NULL,
  `official` BIT DEFAULT 0,
  `url` varchar(2048) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  `level` int(1) NOT NULL DEFAULT '0',
  `name` varchar(32) NOT NULL,
  `description` varchar(256) NOT NULL,
  `language` varchar(16) NOT NULL,
  `robot` varchar(32) NOT NULL,
  `commitment` int(11) NOT NULL DEFAULT '0',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `published` tinyint(1) NOT NULL DEFAULT '0',
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `benchmark`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `benchmark`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;


CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `email` varchar(254) NOT NULL,
  `username` varchar(32) NOT NULL,
  `password` varchar(64) NOT NULL,
  `name` varchar(64) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `avatar` varchar(2048) NOT NULL,
  `url` varchar(2048) NOT NULL,
  `about` varchar(128) NOT NULL,
  `token` varchar(32) CHARACTER SET ascii COLLATE ascii_bin DEFAULT NULL,
  `joined` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email` (`username`);

ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;


CREATE TABLE `rankings` (
  `user` int(11) NOT NULL,
  `benchmark` int(11) NOT NULL,
  `performance` double NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `rankings`
  ADD PRIMARY KEY (`user`,`benchmark`),
  ADD KEY `benchmark` (`benchmark`),
  ADD KEY `performance` (`performance`);

ALTER TABLE `rankings`
  ADD CONSTRAINT `benchmark` FOREIGN KEY (`benchmark`) REFERENCES `benchmark` (`id`),
  ADD CONSTRAINT `user` FOREIGN KEY (`user`) REFERENCES `user` (`id`);
