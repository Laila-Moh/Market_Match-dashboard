-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: computer_app
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bank`
--

DROP TABLE IF EXISTS `bank`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bank` (
  `bank_ID` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `branch` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`bank_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bank`
--

LOCK TABLES `bank` WRITE;
/*!40000 ALTER TABLE `bank` DISABLE KEYS */;
/*!40000 ALTER TABLE `bank` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bid_history`
--

DROP TABLE IF EXISTS `bid_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bid_history` (
  `bid_ID` int NOT NULL AUTO_INCREMENT,
  `type` varchar(255) DEFAULT NULL,
  `status` enum('Pending','Approved','Rejected') NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `date_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `admin_ID` int DEFAULT NULL,
  `org_rep_ID` int DEFAULT NULL,
  `campaign_ID` int DEFAULT NULL,
  PRIMARY KEY (`bid_ID`),
  KEY `fk_bid_history_admin` (`admin_ID`),
  KEY `fk_bid_history_org_rep` (`org_rep_ID`),
  KEY `fk_bid_history_campaign` (`campaign_ID`),
  CONSTRAINT `fk_bid_history_admin` FOREIGN KEY (`admin_ID`) REFERENCES `admin` (`admin_ID`),
  CONSTRAINT `fk_bid_history_campaign` FOREIGN KEY (`campaign_ID`) REFERENCES `campaign` (`campaign_ID`),
  CONSTRAINT `fk_bid_history_org_rep` FOREIGN KEY (`org_rep_ID`) REFERENCES `organization_representative` (`org_rep_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bid_history`
--

LOCK TABLES `bid_history` WRITE;
/*!40000 ALTER TABLE `bid_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `bid_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `campaign`
--

DROP TABLE IF EXISTS `campaign`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `campaign` (
  `campaign_ID` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `bid_ID` int DEFAULT NULL,
  `org_rep_ID` int DEFAULT NULL,
  `crm_ID` int DEFAULT NULL,
  PRIMARY KEY (`campaign_ID`),
  KEY `bid_ID` (`bid_ID`),
  KEY `fk_marketing_campaign_org_rep` (`org_rep_ID`),
  KEY `fk_campaign_crm` (`crm_ID`),
  CONSTRAINT `campaign_ibfk_1` FOREIGN KEY (`bid_ID`) REFERENCES `bid_history` (`bid_ID`) ON DELETE SET NULL,
  CONSTRAINT `fk_campaign_crm` FOREIGN KEY (`crm_ID`) REFERENCES `crm` (`crm_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_marketing_campaign_org_rep` FOREIGN KEY (`org_rep_ID`) REFERENCES `organization_representative` (`org_rep_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campaign`
--

LOCK TABLES `campaign` WRITE;
/*!40000 ALTER TABLE `campaign` DISABLE KEYS */;
/*!40000 ALTER TABLE `campaign` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contract`
--

DROP TABLE IF EXISTS `contract`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contract` (
  `contract_ID` int NOT NULL AUTO_INCREMENT,
  `description` text,
  `number` varchar(50) DEFAULT NULL,
  `marketer_ID` int DEFAULT NULL,
  `org_rep_ID` int DEFAULT NULL,
  PRIMARY KEY (`contract_ID`),
  UNIQUE KEY `number` (`number`),
  KEY `fk_contract_marketer` (`marketer_ID`),
  KEY `fk_contract_org_rep` (`org_rep_ID`),
  CONSTRAINT `contract_ibfk_1` FOREIGN KEY (`marketer_ID`) REFERENCES `marketer` (`marketer_ID`) ON DELETE CASCADE,
  CONSTRAINT `contract_ibfk_2` FOREIGN KEY (`org_rep_ID`) REFERENCES `organization_representative` (`org_rep_ID`) ON DELETE CASCADE,
  CONSTRAINT `fk_contract_marketer` FOREIGN KEY (`marketer_ID`) REFERENCES `marketer` (`marketer_ID`),
  CONSTRAINT `fk_contract_org_rep` FOREIGN KEY (`org_rep_ID`) REFERENCES `organization_representative` (`org_rep_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contract`
--

LOCK TABLES `contract` WRITE;
/*!40000 ALTER TABLE `contract` DISABLE KEYS */;
/*!40000 ALTER TABLE `contract` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `crm`
--

DROP TABLE IF EXISTS `crm`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `crm` (
  `crm_id` int NOT NULL AUTO_INCREMENT,
  `client_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `industry` varchar(100) DEFAULT NULL,
  `status` enum('Lead','Opportunity','Customer','Lost') DEFAULT 'Lead',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`crm_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `crm`
--

LOCK TABLES `crm` WRITE;
/*!40000 ALTER TABLE `crm` DISABLE KEYS */;
/*!40000 ALTER TABLE `crm` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `description` text,
  `rating` int DEFAULT NULL,
  `user_ID` int DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `fk_feedback_user` (`user_ID`),
  CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `user` (`user_ID`) ON DELETE CASCADE,
  CONSTRAINT `fk_feedback_user` FOREIGN KEY (`user_ID`) REFERENCES `user` (`user_ID`),
  CONSTRAINT `feedback_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoice`
--

DROP TABLE IF EXISTS `invoice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoice` (
  `invoice_ID` int NOT NULL AUTO_INCREMENT,
  `type` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `bank_ID` int DEFAULT NULL,
  PRIMARY KEY (`invoice_ID`),
  KEY `fk_invoice_bank` (`bank_ID`),
  CONSTRAINT `fk_invoice_bank` FOREIGN KEY (`bank_ID`) REFERENCES `bank` (`bank_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoice`
--

LOCK TABLES `invoice` WRITE;
/*!40000 ALTER TABLE `invoice` DISABLE KEYS */;
/*!40000 ALTER TABLE `invoice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `marketer`
--

DROP TABLE IF EXISTS `marketer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `marketer` (
  `marketer_ID` int NOT NULL AUTO_INCREMENT,
  `portfolio` text,
  `logo` text,
  `authorization` varchar(255) DEFAULT NULL,
  `years_of_experience` int DEFAULT NULL,
  `certifications` text,
  `crm_ID` int DEFAULT NULL,
  PRIMARY KEY (`marketer_ID`),
  KEY `fk_marketer_crm` (`crm_ID`),
  CONSTRAINT `fk_marketer_crm` FOREIGN KEY (`crm_ID`) REFERENCES `crm` (`crm_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `marketer`
--

LOCK TABLES `marketer` WRITE;
/*!40000 ALTER TABLE `marketer` DISABLE KEYS */;
/*!40000 ALTER TABLE `marketer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `notification_ID` int NOT NULL AUTO_INCREMENT,
  `description` text,
  `user_ID` int DEFAULT NULL,
  PRIMARY KEY (`notification_ID`),
  KEY `fk_notification_user` (`user_ID`),
  CONSTRAINT `fk_notification_user` FOREIGN KEY (`user_ID`) REFERENCES `user` (`user_ID`),
  CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `user` (`user_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `organization_representative`
--

DROP TABLE IF EXISTS `organization_representative`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `organization_representative` (
  `org_rep_ID` int NOT NULL AUTO_INCREMENT,
  `organization_name` varchar(255) NOT NULL,
  `industry_focus` varchar(255) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `annual_budget` decimal(15,2) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `logo` text,
  `size` varchar(100) DEFAULT NULL,
  `crm_ID` int DEFAULT NULL,
  PRIMARY KEY (`org_rep_ID`),
  KEY `fk_org_rep_crm` (`crm_ID`),
  CONSTRAINT `fk_org_rep_crm` FOREIGN KEY (`crm_ID`) REFERENCES `crm` (`crm_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organization_representative`
--

LOCK TABLES `organization_representative` WRITE;
/*!40000 ALTER TABLE `organization_representative` DISABLE KEYS */;
/*!40000 ALTER TABLE `organization_representative` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `payment_ID` int NOT NULL AUTO_INCREMENT,
  `amount` decimal(10,2) NOT NULL,
  `invoice_ID` int DEFAULT NULL,
  `org_rep_ID` int DEFAULT NULL,
  `marketer_ID` int DEFAULT NULL,
  `contract_ID` int DEFAULT NULL,
  PRIMARY KEY (`payment_ID`),
  KEY `marketer_ID` (`marketer_ID`),
  KEY `fk_payment_org_rep` (`org_rep_ID`),
  KEY `fk_payment_invoice` (`invoice_ID`),
  KEY `fk_payment_contract` (`contract_ID`),
  CONSTRAINT `fk_payment_contract` FOREIGN KEY (`contract_ID`) REFERENCES `contract` (`contract_ID`),
  CONSTRAINT `fk_payment_invoice` FOREIGN KEY (`invoice_ID`) REFERENCES `invoice` (`invoice_ID`),
  CONSTRAINT `fk_payment_org_rep` FOREIGN KEY (`org_rep_ID`) REFERENCES `organization_representative` (`org_rep_ID`),
  CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`invoice_ID`) REFERENCES `invoice` (`invoice_ID`) ON DELETE SET NULL,
  CONSTRAINT `payment_ibfk_2` FOREIGN KEY (`org_rep_ID`) REFERENCES `organization_representative` (`org_rep_ID`) ON DELETE CASCADE,
  CONSTRAINT `payment_ibfk_3` FOREIGN KEY (`marketer_ID`) REFERENCES `marketer` (`marketer_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_method`
--

DROP TABLE IF EXISTS `payment_method`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_method` (
  `method_ID` int NOT NULL AUTO_INCREMENT,
  `invoice_ID` int DEFAULT NULL,
  `bank_ID` int DEFAULT NULL,
  PRIMARY KEY (`method_ID`),
  KEY `invoice_ID` (`invoice_ID`),
  KEY `bank_ID` (`bank_ID`),
  CONSTRAINT `payment_method_ibfk_1` FOREIGN KEY (`invoice_ID`) REFERENCES `invoice` (`invoice_ID`) ON DELETE CASCADE,
  CONSTRAINT `payment_method_ibfk_2` FOREIGN KEY (`bank_ID`) REFERENCES `bank` (`bank_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_method`
--

LOCK TABLES `payment_method` WRITE;
/*!40000 ALTER TABLE `payment_method` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment_method` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project`
--

DROP TABLE IF EXISTS `project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project` (
  `project_ID` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `cost` decimal(10,2) DEFAULT NULL,
  `duration` int DEFAULT NULL COMMENT 'Duration in days',
  `campaign_ID` int DEFAULT NULL,
  PRIMARY KEY (`project_ID`),
  KEY `fk_project_campaign` (`campaign_ID`),
  CONSTRAINT `fk_project_campaign` FOREIGN KEY (`campaign_ID`) REFERENCES `campaign` (`campaign_ID`),
  CONSTRAINT `project_ibfk_1` FOREIGN KEY (`campaign_ID`) REFERENCES `campaign` (`campaign_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project`
--

LOCK TABLES `project` WRITE;
/*!40000 ALTER TABLE `project` DISABLE KEYS */;
/*!40000 ALTER TABLE `project` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `report`
--

DROP TABLE IF EXISTS `report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `report` (
  `report_ID` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `details` text,
  `type` varchar(255) DEFAULT NULL,
  `campaign_ID` int DEFAULT NULL,
  PRIMARY KEY (`report_ID`),
  KEY `fk_report_campaign` (`campaign_ID`),
  CONSTRAINT `fk_report_campaign` FOREIGN KEY (`campaign_ID`) REFERENCES `campaign` (`campaign_ID`),
  CONSTRAINT `report_ibfk_1` FOREIGN KEY (`campaign_ID`) REFERENCES `campaign` (`campaign_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report`
--

LOCK TABLES `report` WRITE;
/*!40000 ALTER TABLE `report` DISABLE KEYS */;
/*!40000 ALTER TABLE `report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service`
--

DROP TABLE IF EXISTS `service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service` (
  `service_ID` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `marketer_ID` int DEFAULT NULL,
  `org_rep_ID` int DEFAULT NULL,
  PRIMARY KEY (`service_ID`),
  KEY `fk_service_marketer` (`marketer_ID`),
  KEY `fk_service_org_rep` (`org_rep_ID`),
  CONSTRAINT `fk_service_marketer` FOREIGN KEY (`marketer_ID`) REFERENCES `marketer` (`marketer_ID`),
  CONSTRAINT `fk_service_org_rep` FOREIGN KEY (`org_rep_ID`) REFERENCES `organization_representative` (`org_rep_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service`
--

LOCK TABLES `service` WRITE;
/*!40000 ALTER TABLE `service` DISABLE KEYS */;
/*!40000 ALTER TABLE `service` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_ID` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(255) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `user_address` text,
  `role` enum('Admin','Marketer','Org_Rep') NOT NULL,
  `user_type` varchar(50) NOT NULL DEFAULT 'standard',
  `crm_ID` int DEFAULT NULL,
  PRIMARY KEY (`user_ID`),
  UNIQUE KEY `user_email` (`user_email`),
  KEY `fk_user_crm` (`crm_ID`),
  CONSTRAINT `fk_user_crm` FOREIGN KEY (`crm_ID`) REFERENCES `crm` (`crm_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'computer_app'
--

--
-- Dumping routines for database 'computer_app'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-17 12:34:26
