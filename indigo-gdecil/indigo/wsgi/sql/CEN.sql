-- CEN_ATTACHEMENTS
-- CEN_BATCH_AMOUNTS
-- CEN_BATCHES
-- CEN_NOTEBOOKS
-- CEN_PAGES
-- CEN_REACTION_SCHEMES
-- CEN_STRUCTURES
-- TGB1
-- TGV1

CREATE TABLE cen_structures (
	struct_key varchar(256) NOT NULL,
	page_key varchar(256),
	struct_sketch bytea ,
	native_struct_sketch bytea ,
	struct_image bytea ,
	xml_metadata xml,
	chemical_name varchar(400),
	molecular_formula varchar(100),
	molecular_weight bigint,
	virtual_compound_id varchar(50),
	registration_number varchar(50),
	cas_number varchar(20),
	struct_skth_frmt varchar(15),
	native_struct_skth_frmt varchar(15),
	struct_image_frmt varchar(15),
	user_hazard_comments varchar(4000),
	struct_comments varchar(200),
	stereoisomer_code varchar(10),
	compound_name varchar(400),
	boiling_pt_value bigint,
	boiling_pt_unit_code varchar(5),
	melting_pt_value bigint,
	melting_pt_unit_code varchar(5),
	created_by_notebook varchar(5),
	exact_mass bigint,
	compound_parent_id varchar(25),
	version bigint DEFAULT 0,
	last_modified timestamp with time zone DEFAULT current_timestamp,
	stoich_comments varchar(100)
);
ALTER TABLE cen_structures ADD PRIMARY KEY (struct_key);
CREATE INDEX cen_structures_i5 ON cen_structures (virtual_compound_id);
CREATE INDEX cen_structures_i3 ON cen_structures (registration_number);
CREATE INDEX cen_structures_i4 ON cen_structures (chemical_name);
CREATE INDEX cen_structures_i1 ON cen_structures (page_key);

CREATE TABLE cen_pages (
	page_key varchar(256) NOT NULL,
	site_code varchar(16),
	notebook varchar(8),
	experiment varchar(4),
	username varchar(50),
	owner_username varchar(50),
	look_n_feel varchar(10),
	page_status varchar(15),
	creation_date timestamp with time zone,
	modified_date timestamp with time zone,
	xml_metadata xml,
	procedure text ,
	page_version smallint,
	latest_version varchar(1),
	pdf_document bytea ,
	spid varchar(32),
	ta_code varchar(10),
	project_code varchar(54),
	literature_ref varchar(1800),
	subject varchar(1000),
	series_id varchar(15),
	protocol_id varchar(25),
	migrated_to_pcen varchar(2) DEFAULT 'N',
	batch_owner varchar(50),
	batch_creator varchar(50),
	design_submitter varchar(50),
	nbk_ref_version varchar(16),
	version bigint DEFAULT 0,
	yield smallint,
	issuccessful varchar(1)
);
ALTER TABLE cen_pages ADD UNIQUE (nbk_ref_version);
ALTER TABLE cen_pages ADD PRIMARY KEY (page_key);
CREATE INDEX cen_pages_i6 ON cen_pages (project_code);
CREATE INDEX cen_pages_i3 ON cen_pages (site_code,username);
CREATE INDEX cen_pages_i8 ON cen_pages (subject);
CREATE INDEX cen_pages_i9 ON cen_pages (look_n_feel);
CREATE INDEX cen_pages_i5 ON cen_pages (ta_code);
CREATE INDEX cen_pages_i12 ON cen_pages (spid);
CREATE INDEX cen_pages_i10 ON cen_pages (page_status);
CREATE INDEX cen_pages_i1 ON cen_pages (site_code,notebook,experiment);

CREATE TABLE cen_attachements (
	attachement_key varchar(256) NOT NULL,
	page_key varchar(256),
	xml_metadata xml,
	blob_data bytea ,
	date_modified varchar(30),
	document_description varchar(400),
	document_name varchar(256),
	ip_related varchar(1),
	original_file_name varchar(512),
	document_size bigint,
	document_type varchar(30),
	version bigint DEFAULT 0,
	last_modified timestamp with time zone DEFAULT current_timestamp
);
ALTER TABLE cen_attachements ADD PRIMARY KEY (attachement_key);
CREATE INDEX cen_attachements_i1 ON cen_attachements (page_key);

CREATE TABLE tgv1 (
	compound text,
	str_id bigint NOT NULL
);

CREATE TABLE cen_batches (
	batch_key varchar(256) NOT NULL,
	page_key varchar(256),
	batch_number varchar(30),
	struct_key varchar(256),
	xml_metadata xml,
	step_key varchar(256),
	batch_type varchar(32),
	molecular_formula varchar(100),
	theoritical_yield_percent bigint,
	salt_code varchar(5),
	salt_equivs bigint,
	list_key varchar(256),
	batch_mw_value bigint,
	batch_mw_unit_code varchar(5),
	batch_mw_is_calc char(1) DEFAULT 'Y',
	batch_mw_sig_digits bigint,
	batch_mw_sig_digits_set char(1) DEFAULT 'Y',
	batch_mw_user_pref_figs bigint,
	is_limiting varchar(1) DEFAULT 'N',
	auto_calc varchar(1),
	synthszd_by varchar(50),
	added_solv_batch_key varchar(256),
	no_of_times_used bigint,
	intd_addition_order bigint,
	chloracnegen_type varchar(20),
	is_chloracnegen varchar(1),
	tested_for_chloracnegen varchar(1) DEFAULT 'N',
	version bigint DEFAULT 0,
	last_modified timestamp with time zone DEFAULT current_timestamp
);
ALTER TABLE cen_batches ADD PRIMARY KEY (batch_key);
CREATE INDEX cen_batches_i5 ON cen_batches (struct_key);
CREATE INDEX cen_batches_i10 ON cen_batches (list_key);
CREATE INDEX cen_batches_i7 ON cen_batches (theoritical_yield_percent);
CREATE INDEX cen_batches_i1 ON cen_batches (page_key);
CREATE INDEX cen_batches_i9 ON cen_batches (step_key);
CREATE INDEX cen_batches_i3 ON cen_batches (molecular_formula);
CREATE INDEX cen_batches_i2 ON cen_batches (batch_number);
CREATE INDEX cen_batches_i8 ON cen_batches (batch_type);

CREATE TABLE cen_reaction_schemes (
	rxn_scheme_key varchar(256) NOT NULL,
	page_key varchar(256),
	reaction_type varchar(10),
	rxn_sketch bytea ,
	native_rxn_sketch bytea ,
	sketch_image bytea ,
	xml_metadata xml,
	vrxn_id varchar(512),
	protocol_id varchar(32),
	rxn_skth_frmt varchar(15),
	native_rxn_skth_frmt varchar(15),
	rxn_image_frmt varchar(15),
	synth_route_ref varchar(20),
	reaction_id varchar(20),
	version bigint DEFAULT 0,
	last_modified timestamp with time zone DEFAULT current_timestamp
);
ALTER TABLE cen_reaction_schemes ADD PRIMARY KEY (rxn_scheme_key);
CREATE INDEX cen_reaction_schemes_i4 ON cen_reaction_schemes (protocol_id);
CREATE INDEX cen_reaction_schemes_i1 ON cen_reaction_schemes (page_key);
CREATE INDEX cen_reaction_schemes_i3 ON cen_reaction_schemes (vrxn_id);

CREATE TABLE tgb1 (
	compound text,
	str_id bigint NOT NULL
);
ALTER TABLE tgb1 ADD PRIMARY KEY (str_id);


CREATE TABLE cen_batch_amounts (
	batch_key varchar(256),
	page_key varchar(256),
	weight_value bigint,
	weight_unit_code varchar(5),
	weight_is_calc char(1) DEFAULT 'Y',
	weight_sig_digits bigint,
	weight_sig_digits_set char(1) DEFAULT 'Y',
	weight_user_pref_figs bigint,
	volume_value bigint,
	volume_unit_code varchar(5),
	volume_is_calc char(1) DEFAULT 'Y',
	volume_sig_digits bigint,
	volume_sig_digits_set char(1) DEFAULT 'Y',
	volume_user_pref_figs bigint,
	molarity_value bigint,
	molarity_unit_code varchar(5),
	molarity_is_calc char(1) DEFAULT 'Y',
	molarity_sig_digits bigint,
	molarity_sig_digits_set char(1) DEFAULT 'Y',
	molarity_user_pref_figs bigint,
	mole_value bigint,
	mole_unit_code varchar(5),
	mole_is_calc char(1) DEFAULT 'Y',
	mole_sig_digits bigint,
	mole_sig_digits_set char(1) DEFAULT 'Y',
	mole_user_pref_figs bigint,
	density_value bigint,
	density_unit_code varchar(5),
	density_is_calc char(1) DEFAULT 'Y',
	density_sig_digits bigint,
	density_sig_digits_set char(1) DEFAULT 'Y',
	density_user_pref_figs bigint,
	purity_value bigint,
	purity_unit_code varchar(5),
	purity_is_calc char(1) DEFAULT 'Y',
	purity_sig_digits bigint,
	purity_sig_digits_set char(1) DEFAULT 'Y',
	purity_user_pref_figs bigint,
	loading_value bigint,
	loading_unit_code varchar(5),
	loading_is_calc char(1) DEFAULT 'Y',
	loading_sig_digits bigint,
	loading_sig_digits_set char(1) DEFAULT 'Y',
	loading_user_pref_figs bigint,
	rxnequivs_value bigint,
	rxnequivs_unit_code varchar(5),
	rxnequivs_is_calc char(1) DEFAULT 'Y',
	rxnequivs_sig_digits bigint,
	rxnequivs_sig_digits_set char(1) DEFAULT 'Y',
	rxnequivs_user_pref_figs bigint,
	theo_wt_value bigint,
	theo_wt_unit_code varchar(5),
	theo_wt_is_calc char(1) DEFAULT 'Y',
	theo_wt_sig_digits bigint,
	theo_wt_sig_digits_set char(1) DEFAULT 'Y',
	theo_wt_user_pref_figs bigint,
	theo_mole_value bigint,
	theo_mole_unit_code varchar(5),
	theo_mole_is_calc char(1) DEFAULT 'Y',
	theo_mole_sig_digits bigint,
	theo_mole_sig_digits_set char(1) DEFAULT 'Y',
	theo_mole_user_pref_figs bigint,
	total_wt_value bigint,
	total_wt_unit_code varchar(5),
	total_wt_is_calc char(1) DEFAULT 'Y',
	total_wt_sig_digits bigint,
	total_wt_sig_digits_set char(1) DEFAULT 'Y',
	total_wt_user_pref_figs bigint,
	total_vol_value bigint,
	total_vol_unit_code varchar(5),
	total_vol_is_calc char(1) DEFAULT 'Y',
	total_vol_sig_digits bigint,
	total_vol_sig_digits_set char(1) DEFAULT 'Y',
	total_vol_user_pref_figs bigint,
	deliv_wt_value bigint,
	deliv_wt_unit_code varchar(5),
	deliv_wt_is_calc char(1) DEFAULT 'Y',
	deliv_wt_sig_digits bigint,
	deliv_wt_sig_digits_set char(1) DEFAULT 'Y',
	deliv_wt_user_pref_figs bigint,
	deliv_vol_value bigint,
	deliv_vol_unit_code varchar(5),
	deliv_vol_is_calc char(1) DEFAULT 'Y',
	deliv_vol_sig_digits bigint,
	deliv_vol_sig_digits_set char(1) DEFAULT 'Y',
	deliv_vol_user_pref_figs bigint,
	needed_mole_value bigint,
	needed_mole_unit_code varchar(5),
	needed_mole_is_calc char(1) DEFAULT 'Y',
	needed_mole_sig_digits bigint,
	needed_mole_sig_digits_set char(1) DEFAULT 'Y',
	needed_mole_user_pref_figs bigint,
	ex_neded_mole_value bigint,
	ex_neded_mole_unit_code varchar(5),
	ex_neded_mole_is_calc char(1) DEFAULT 'Y',
	ex_neded_mole_sig_digits bigint,
	ex_neded_mole_sig_digits_set char(1) DEFAULT 'Y',
	ex_neded_mole_user_pref_figs bigint,
	solute_wt_value bigint,
	solute_wt_unit_code varchar(5),
	solute_wt_is_calc char(1) DEFAULT 'Y',
	solute_wt_sig_digits bigint,
	solute_wt_sig_digits_set char(1) DEFAULT 'Y',
	solute_wt_user_pref_figs bigint,
	prev_molar_value bigint,
	prev_molar_unit_code varchar(5),
	prev_molar_is_calc char(1) DEFAULT 'Y',
	prev_molar_sig_digits bigint,
	prev_molar_sig_digits_set char(1) DEFAULT 'Y',
	prev_molar_user_pref_figs bigint,
	theo_yld_pcnt_value bigint,
	theo_yld_pcnt_unit_code varchar(5),
	theo_yld_pcnt_is_calc char(1) DEFAULT 'Y',
	theo_yld_pcnt_sig_digits bigint,
	theo_yld_pcnt_sig_digits_set char(1) DEFAULT 'Y',
	theo_yld_pcnt_user_pref_figs bigint,
	version bigint DEFAULT 0,
	last_modified timestamp with time zone DEFAULT current_timestamp
);
CREATE INDEX cen_batch_amounts_i1 ON cen_batch_amounts (batch_key);
CREATE INDEX cen_batch_amounts_i2 ON cen_batch_amounts (page_key);

CREATE TABLE cen_notebooks (
	site_code varchar(16) NOT NULL,
	username varchar(50) NOT NULL,
	notebook varchar(8) NOT NULL,
	status varchar(15),
	xml_metadata xml,
	id bigint,
	version bigint,
	last_modified timestamp with time zone DEFAULT current_timestamp
);
ALTER TABLE cen_notebooks ADD PRIMARY KEY (site_code,username,notebook);

ALTER TABLE cen_structures ADD CONSTRAINT cen_structures_fk1 FOREIGN KEY (page_key) REFERENCES cen_pages(page_key) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE cen_pages ADD CONSTRAINT cen_pages_fk1 FOREIGN KEY (site_code,username,notebook) REFERENCES cen_notebooks(site_code,username,notebook) ON DELETE NO ACTION NOT DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE cen_attachements ADD CONSTRAINT cen_attachements_fk1 FOREIGN KEY (page_key) REFERENCES cen_pages(page_key) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE cen_batches ADD CONSTRAINT cen_batches_fk1 FOREIGN KEY (page_key) REFERENCES cen_pages(page_key) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE cen_reaction_schemes ADD CONSTRAINT cen_reaction_schemes_fk1 FOREIGN KEY (page_key) REFERENCES cen_pages(page_key) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE cen_batch_amounts ADD CONSTRAINT cen_batch_amounts_fk1 FOREIGN KEY (batch_key) REFERENCES cen_batches(batch_key) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE cen_batch_amounts ADD CONSTRAINT cen_batch_amounts_fk2 FOREIGN KEY (page_key) REFERENCES cen_pages(page_key) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;
