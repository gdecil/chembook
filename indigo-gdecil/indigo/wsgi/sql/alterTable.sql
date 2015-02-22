drop view batch_vw;
drop view batch_lev3_vw;

ALTER TABLE cen_batches ALTER COLUMN batch_mw_value SET DATA TYPE numeric;
ALTER TABLE cen_batches ALTER COLUMN salt_equivs SET DATA TYPE numeric;

ALTER TABLE cen_structures ALTER COLUMN molecular_weight SET DATA TYPE numeric;
ALTER TABLE cen_structures ALTER COLUMN boiling_pt_value SET DATA TYPE numeric;
ALTER TABLE cen_structures ALTER COLUMN melting_pt_value SET DATA TYPE numeric;
ALTER TABLE cen_structures ALTER COLUMN exact_mass SET DATA TYPE numeric;