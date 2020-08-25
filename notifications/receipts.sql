/*
 * Create sqlite database table for local storage of read receipts
 */
create table if not exists receipts (id integer primary key autoincrement, message_id text)
