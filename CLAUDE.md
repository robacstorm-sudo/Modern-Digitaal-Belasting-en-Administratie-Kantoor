# CLAUDE.md

Dit bestand geeft Claude Code context over EasyStock. Taal van communicatie: Nederlands.

## Project

EasyStock is een voorraad-, inkoop- en verkoopadministratie, onderdeel van het
Modern Digitaal Belasting en Administratie Kantoor. Deze GitHub-repository
(`robacstorm-sudo/Modern-Digitaal-Belasting-en-Administratie-Kantoor`) bevat op dit
moment nog geen code.

## Waar staat de code

- De broncode van EasyStock staat lokaal op de computer van de eigenaar in
  `C:\Software\CTP\EasyStock`.
- Die map is niet bereikbaar vanuit cloud-sessies. Vraag om de relevante bestanden
  of laat ze naar deze repository pushen voordat je aan de code werkt.
- Verzin geen techstack of bestandsstructuur: controleer eerst wat er echt staat.

## Backend: Supabase

- Projectnaam: **EasyStock**
- Project-ID: `wcsmgaboivbemprazjpk`
- Regio: `eu-west-1`
- Database: Postgres 17
- Let op: er zijn nog twee andere Supabase-projecten in dit account
  ("robacstorm-sudo's Project" en "Interim Detachering Project"). Gebruik die niet
  voor EasyStock.
- Geen sleutels of wachtwoorden in dit bestand of in de repository zetten.

### Database (schema `public`, 22 tabellen)

| Domein | Tabellen |
| --- | --- |
| Voorraad | `items`, `item_categories`, `item_serials`, `stock_levels`, `stock_movements`, `locations`, `warehouses` |
| Inkoop | `purchase_orders`, `purchase_order_lines`, `pakbonnen` |
| Verkoop | `sales_documents`, `sales_document_lines`, `sales_invoices`, `sales_invoice_lines`, `sales_proformas` |
| Relaties en instellingen | `relations`, `profiles`, `app_settings`, `country_codes` |
| Systeem | `audit_log`, `migration_errors`, `password_reset_unknown_attempts` |

Grootte (stand 2026-10-08): database 13 MB, de grootste tabel is `stock_movements`
(144 kB). De data is dus nog beperkt (o.a. 5 items, 2 inkooporders).

### Storage

- Bucket `invoices`: 10 bestanden, samen 96 kB. Er zijn geen andere buckets.

## Werkafspraken

- Inspecteer eerst de bestaande tabellen voordat je het schema wijzigt.
- Schemawijzigingen gaan via migraties, niet via losse SQL.
- Voer op de database eerst alleen leesquery's uit; vraag bevestiging voor
  verwijderen of overschrijven van data.
- Bij financiële documenten (facturen, proforma's, pakbonnen) en `audit_log`:
  wijzig of verwijder nooit bestaande records zonder expliciete toestemming.
- Werk op de aangewezen featurebranch en maak alleen een pull request als erom
  gevraagd wordt.

## Nog in te vullen

- Techstack en commando's (installeren, draaien, testen, bouwen) zodra de code uit
  `C:\Software\CTP\EasyStock` beschikbaar is.
- Mappenstructuur van de code.
- Relaties tussen tabellen en RLS-beleid (nog niet onderzocht).
