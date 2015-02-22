BEGIN;
drop schema bingo cascade;
delete from pg_am where amname='bingo_idx';
COMMIT;
