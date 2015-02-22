BEGIN;
CREATE SCHEMA bingo;
SET search_path = bingo;
CREATE OR REPLACE FUNCTION getVersion()
RETURNS text
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION importSDF(text, text, text, text)
RETURNS void
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C VOLATILE;

CREATE OR REPLACE FUNCTION importRDF(text, text, text, text)
RETURNS void
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C VOLATILE;

CREATE OR REPLACE FUNCTION importSmiles(text, text, text, text)
RETURNS void
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C VOLATILE;

CREATE OR REPLACE FUNCTION exportSDF(text, text, text, text)
RETURNS void
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C IMMUTABLE;

CREATE OR REPLACE FUNCTION exportRDF(text, text, text, text)
RETURNS void
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C IMMUTABLE;

CREATE OR REPLACE FUNCTION fileToText(text)
RETURNS text
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION fileToBlob(text)
RETURNS bytea
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION getName(text)
RETURNS text
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION getIndexStructuresCount(oid)
RETURNS integer
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION _internal_func_check(integer)
RETURNS boolean
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION _get_profiling_info()
RETURNS cstring
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION _reset_profiling_info()
RETURNS void
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION _print_profiling_info()
RETURNS void
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;




CREATE OR REPLACE FUNCTION _internal_func_011(integer, text, text) RETURNS void AS $$
BEGIN 
IF NOT bingo._internal_func_check($1) 
THEN RETURN;
END IF;
INSERT INTO pg_depend (classid, objid, objsubid, refclassid, refobjid, refobjsubid, deptype) 
VALUES (
'pg_class'::regclass::oid, $2::regclass::oid, 0, 
'pg_class'::regclass::oid, $3::regclass::oid, 0, 'i');
end;
$$ LANGUAGE 'plpgsql' SECURITY DEFINER;

CREATE OR REPLACE FUNCTION _internal_func_012(integer, text) RETURNS void AS $$
BEGIN 
IF NOT bingo._internal_func_check($1) 
THEN RETURN;
END IF;
DELETE FROM pg_depend WHERE objid=$2::regclass::oid;
end;
$$ LANGUAGE 'plpgsql' SECURITY DEFINER;
CREATE OR REPLACE FUNCTION getWeight(text, text)
RETURNS real
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION getWeight(bytea, text)
RETURNS real
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION getMass(text)
RETURNS real
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION getMass(bytea)
RETURNS real
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION smiles(text)
RETURNS text
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION smiles(bytea)
RETURNS text
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION cansmiles(text)
RETURNS text
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION cansmiles(bytea)
RETURNS text
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION molfile(text)
RETURNS text
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION molfile(bytea)
RETURNS text
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION cml(text)
RETURNS text
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION cml(bytea)
RETURNS text
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION checkMolecule(text)
RETURNS text
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION checkMolecule(bytea)
RETURNS text
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION gross(text)
RETURNS text
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION gross(bytea)
RETURNS text
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION fingerprint(text, text)
RETURNS bytea
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION fingerprint(bytea, text)
RETURNS bytea
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION compactmolecule(text, boolean)
RETURNS bytea
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION compactmolecule(bytea, boolean)
RETURNS bytea
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION inchi(text, text)
RETURNS text
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION inchi(bytea, text)
RETURNS text
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION inchikey(text)
RETURNS text
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION _sub_internal(text, text, text)
RETURNS boolean
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION _sub_internal(text, bytea, text)
RETURNS boolean
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION _smarts_internal(text, text, text)
RETURNS boolean
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION _smarts_internal(text, bytea, text)
RETURNS boolean
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION _exact_internal(text, text, text)
RETURNS boolean
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION _exact_internal(text, bytea, text)
RETURNS boolean
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION _gross_internal(text, text, text)
RETURNS boolean
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION _gross_internal(text, text, bytea)
RETURNS boolean
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

--******************* MASS *******************

CREATE TYPE mass;

CREATE OR REPLACE FUNCTION _mass_in(cstring)
    RETURNS mass
    AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
    LANGUAGE C IMMUTABLE STRICT;

CREATE OR REPLACE FUNCTION _mass_out(mass)
    RETURNS cstring
    AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
    LANGUAGE C IMMUTABLE STRICT;

CREATE TYPE mass (
   internallength = variable, 
   input = _mass_in,
   output = _mass_out
);

CREATE OR REPLACE FUNCTION _match_mass_great(text, mass)
RETURNS boolean
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION _match_mass_great(bytea, mass)
RETURNS boolean
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION _match_mass_less(text, mass)
RETURNS boolean
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION _match_mass_less(bytea, mass)
RETURNS boolean
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

--******************* SIMILARITY *******************

CREATE OR REPLACE FUNCTION getSimilarity(text, text, text)
RETURNS real
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION getSimilarity(bytea, text, text)
RETURNS real
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE TYPE sim AS (min_bound real, max_bound real, query_mol text, query_options text);

CREATE OR REPLACE FUNCTION _sim_internal(real, real, text, text, text)
RETURNS boolean
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION _sim_internal(real, real, text, bytea, text)
RETURNS boolean
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;
CREATE TYPE sub AS (query_mol text, query_options text);

CREATE OR REPLACE FUNCTION matchSub(text, sub)
RETURNS boolean AS $$
   BEGIN
	RETURN bingo._sub_internal($2.query_mol, $1, $2.query_options);
   END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION matchSub(bytea, sub)
RETURNS boolean AS $$
   BEGIN
	RETURN bingo._sub_internal($2.query_mol, $1, $2.query_options);
   END;
$$ LANGUAGE 'plpgsql';

CREATE TYPE exact AS (query_mol text, query_options text);

CREATE OR REPLACE FUNCTION matchExact(text, exact)
RETURNS boolean AS $$
   BEGIN
	RETURN bingo._exact_internal($2.query_mol, $1, $2.query_options);
   END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION matchExact(bytea, exact)
RETURNS boolean AS $$
   BEGIN
	RETURN bingo._exact_internal($2.query_mol, $1, $2.query_options);
   END;
$$ LANGUAGE 'plpgsql';

CREATE TYPE smarts AS (query_mol text, query_options text);

CREATE OR REPLACE FUNCTION matchSmarts(text, smarts)
RETURNS boolean AS $$
   BEGIN
	RETURN bingo._smarts_internal($2.query_mol, $1, $2.query_options);
   END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION matchSmarts(bytea, smarts)
RETURNS boolean AS $$
   BEGIN
	RETURN bingo._smarts_internal($2.query_mol, $1, $2.query_options);
   END;
$$ LANGUAGE 'plpgsql';

CREATE TYPE gross AS (sign text, query_mol text);

CREATE OR REPLACE FUNCTION matchGross(bytea, gross)
RETURNS boolean AS $$
   BEGIN
	RETURN bingo._gross_internal($2.sign, $2.query_mol, $1);
   END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION matchGross(text, gross)
RETURNS boolean AS $$
   BEGIN
	RETURN bingo._gross_internal($2.sign, $2.query_mol, $1);
   END;
$$ LANGUAGE 'plpgsql';

CREATE OPERATOR public.@ (
        LEFTARG = text,
        RIGHTARG = sub,
        PROCEDURE = matchSub,
        COMMUTATOR = '@',
        RESTRICT = contsel,
        JOIN = contjoinsel
);

CREATE OPERATOR public.@ (
        LEFTARG = bytea,
        RIGHTARG = sub,
        PROCEDURE = matchSub,
        COMMUTATOR = '@',
        RESTRICT = contsel,
        JOIN = contjoinsel
);
CREATE OPERATOR public.@ (
        LEFTARG = text,
        RIGHTARG = exact,
        PROCEDURE = matchExact,
        COMMUTATOR = '@',
        RESTRICT = contsel,
        JOIN = contjoinsel
);
CREATE OPERATOR public.@ (
        LEFTARG = bytea,
        RIGHTARG = exact,
        PROCEDURE = matchExact,
        COMMUTATOR = '@',
        RESTRICT = contsel,
        JOIN = contjoinsel
);
CREATE OPERATOR public.@ (
        LEFTARG = text,
        RIGHTARG = smarts,
        PROCEDURE = matchSmarts,
        COMMUTATOR = '@',
        RESTRICT = contsel,
        JOIN = contjoinsel
);
CREATE OPERATOR public.@ (
        LEFTARG = bytea,
        RIGHTARG = smarts,
        PROCEDURE = matchSmarts,
        COMMUTATOR = '@',
        RESTRICT = contsel,
        JOIN = contjoinsel
);

CREATE OPERATOR public.@ (
        LEFTARG = text,
        RIGHTARG = gross,
        PROCEDURE = matchGross,
        COMMUTATOR = '@',
        RESTRICT = contsel,
        JOIN = contjoinsel
);

CREATE OPERATOR public.@ (
        LEFTARG = bytea,
        RIGHTARG = gross,
        PROCEDURE = matchGross,
        COMMUTATOR = '@',
        RESTRICT = contsel,
        JOIN = contjoinsel
);
--******************* MASS *******************

CREATE OPERATOR public.< (
        LEFTARG = text,
        RIGHTARG = mass,
        PROCEDURE = _match_mass_less,
        COMMUTATOR = '<',
        RESTRICT = contsel,
        JOIN = contjoinsel
);
CREATE OPERATOR public.< (
        LEFTARG = bytea,
        RIGHTARG = mass,
        PROCEDURE = _match_mass_less,
        COMMUTATOR = '<',
        RESTRICT = contsel,
        JOIN = contjoinsel
);

CREATE OPERATOR public.> (
        LEFTARG = text,
        RIGHTARG = mass,
        PROCEDURE = _match_mass_great,
        COMMUTATOR = '>',
        RESTRICT = contsel,
        JOIN = contjoinsel
);

CREATE OPERATOR public.> (
        LEFTARG = bytea,
        RIGHTARG = mass,
        PROCEDURE = _match_mass_great,
        COMMUTATOR = '>',
        RESTRICT = contsel,
        JOIN = contjoinsel
);

--******************* SIMILARITY *******************




CREATE OR REPLACE FUNCTION matchSim(text, sim)
RETURNS boolean AS $$
   BEGIN
	RETURN bingo._sim_internal($2.min_bound, $2.max_bound, $2.query_mol, $1, $2.query_options);
   END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION matchSim(bytea, sim)
RETURNS boolean AS $$
   BEGIN
	RETURN bingo._sim_internal($2.min_bound, $2.max_bound, $2.query_mol, $1, $2.query_options);
   END;
$$ LANGUAGE 'plpgsql';

CREATE OPERATOR public.@ (
        LEFTARG = text,
        RIGHTARG = sim,
        PROCEDURE = matchSim,
        COMMUTATOR = '@',
        RESTRICT = contsel,
        JOIN = contjoinsel
);

CREATE OPERATOR public.@ (
        LEFTARG = bytea,
        RIGHTARG = sim,
        PROCEDURE = matchSim,
        COMMUTATOR = '@',
        RESTRICT = contsel,
        JOIN = contjoinsel
);


CREATE OR REPLACE FUNCTION aam(text, text)
RETURNS text
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION aam(bytea, text)
RETURNS text
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION rxnfile(text)
RETURNS text
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION rxnfile(bytea)
RETURNS text
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION rcml(text)
RETURNS text
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION rcml(bytea)
RETURNS text
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION checkReaction(text)
RETURNS text
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION checkReaction(bytea)
RETURNS text
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION rsmiles(text)
RETURNS text
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION rsmiles(bytea)
RETURNS text
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION rfingerprint(text, text)
RETURNS bytea
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION rfingerprint(bytea, text)
RETURNS bytea
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION compactreaction(text, boolean)
RETURNS bytea
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION compactreaction(bytea, boolean)
RETURNS bytea
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION _rsub_internal(text, text, text)
RETURNS boolean
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION _rsub_internal(text, bytea, text)
RETURNS boolean
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION _rsmarts_internal(text, text, text)
RETURNS boolean
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION _rsmarts_internal(text, bytea, text)
RETURNS boolean
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION _rexact_internal(text, text, text)
RETURNS boolean
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE OR REPLACE FUNCTION _rexact_internal(text, bytea, text)
RETURNS boolean
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT IMMUTABLE;

CREATE TYPE rsub AS (query_reaction text, query_options text);

CREATE OR REPLACE FUNCTION matchRSub(text, rsub)
RETURNS boolean AS $$
   BEGIN
	RETURN bingo._rsub_internal($2.query_reaction, $1, $2.query_options);
   END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION matchRSub(bytea, rsub)
RETURNS boolean AS $$
   BEGIN
	RETURN bingo._rsub_internal($2.query_reaction, $1, $2.query_options);
   END;
$$ LANGUAGE 'plpgsql';

CREATE TYPE rexact AS (query_reaction text, query_options text);

CREATE OR REPLACE FUNCTION matchRExact(text, rexact)
RETURNS boolean AS $$
   BEGIN
	RETURN bingo._rexact_internal($2.query_reaction, $1, $2.query_options);
   END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION matchRExact(bytea, rexact)
RETURNS boolean AS $$
   BEGIN
	RETURN bingo._rexact_internal($2.query_reaction, $1, $2.query_options);
   END;
$$ LANGUAGE 'plpgsql';

CREATE TYPE rsmarts AS (query_reaction text, query_options text);

CREATE OR REPLACE FUNCTION matchRSmarts(text, rsmarts)
RETURNS boolean AS $$
   BEGIN
	RETURN bingo._rsmarts_internal($2.query_reaction, $1, $2.query_options);
   END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION matchRSmarts(bytea, rsmarts)
RETURNS boolean AS $$
   BEGIN
	RETURN bingo._rsmarts_internal($2.query_reaction, $1, $2.query_options);
   END;
$$ LANGUAGE 'plpgsql';

CREATE OPERATOR public.@ (
        LEFTARG = text,
        RIGHTARG = rsub,
        PROCEDURE = matchRSub,
        COMMUTATOR = '@',
        RESTRICT = contsel,
        JOIN = contjoinsel
);
CREATE OPERATOR public.@ (
        LEFTARG = bytea,
        RIGHTARG = rsub,
        PROCEDURE = matchRSub,
        COMMUTATOR = '@',
        RESTRICT = contsel,
        JOIN = contjoinsel
);
CREATE OPERATOR public.@ (
        LEFTARG = text,
        RIGHTARG = rexact,
        PROCEDURE = matchRExact,
        COMMUTATOR = '@',
        RESTRICT = contsel,
        JOIN = contjoinsel
);
CREATE OPERATOR public.@ (
        LEFTARG = bytea,
        RIGHTARG = rexact,
        PROCEDURE = matchRExact,
        COMMUTATOR = '@',
        RESTRICT = contsel,
        JOIN = contjoinsel
);
CREATE OPERATOR public.@ (
        LEFTARG = text,
        RIGHTARG = rsmarts,
        PROCEDURE = matchRSmarts,
        COMMUTATOR = '@',
        RESTRICT = contsel,
        JOIN = contjoinsel
);
CREATE OPERATOR public.@ (
        LEFTARG = bytea,
        RIGHTARG = rsmarts,
        PROCEDURE = matchRSmarts,
        COMMUTATOR = '@',
        RESTRICT = contsel,
        JOIN = contjoinsel
);

CREATE OR REPLACE FUNCTION bingo_build(internal, internal, internal)
RETURNS internal
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT VOLATILE;

CREATE OR REPLACE FUNCTION bingo_buildempty(internal)
RETURNS internal
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT VOLATILE;

CREATE OR REPLACE FUNCTION bingo_insert(internal, internal, internal, internal, internal)
RETURNS boolean
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT VOLATILE;

CREATE OR REPLACE FUNCTION bingo_beginscan(internal, internal, internal)
RETURNS internal
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT VOLATILE;

CREATE OR REPLACE FUNCTION bingo_gettuple(internal, internal)
RETURNS boolean
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT VOLATILE;

CREATE OR REPLACE FUNCTION bingo_rescan(internal, internal)
RETURNS void
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT VOLATILE;

CREATE OR REPLACE FUNCTION bingo_endscan(internal)
RETURNS void
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT VOLATILE;

CREATE OR REPLACE FUNCTION bingo_markpos(internal)
RETURNS void
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT VOLATILE;

CREATE OR REPLACE FUNCTION bingo_restrpos(internal)
RETURNS void
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT VOLATILE;

CREATE OR REPLACE FUNCTION bingo_bulkdelete(internal, internal, internal, internal)
RETURNS internal
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT VOLATILE;

CREATE OR REPLACE FUNCTION bingo_vacuumcleanup(internal, internal)
RETURNS internal
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT VOLATILE;

CREATE OR REPLACE FUNCTION bingo_options(_text, bool)
RETURNS bytea
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT VOLATILE;

CREATE OR REPLACE FUNCTION bingo_costestimate(internal, internal, internal, internal, internal, internal, internal, internal)
RETURNS void
AS '/usr/lib/postgresql/9.1/lib/bingo_postgres'
LANGUAGE C STRICT VOLATILE;

--delete from pg_am where amname='bingo_idx'

INSERT INTO pg_am(
amname,
aminsert,
ambeginscan,
amgettuple,
amgetbitmap,
amrescan,
amendscan,
ammarkpos,
amrestrpos,
ambuild,
ambulkdelete,
amvacuumcleanup,
amcostestimate,
amoptions,
ambuildempty,
amstrategies,
amsupport,
amcanorder,
amcanbackward,
amcanunique,
amcanmulticol,
amoptionalkey,
amsearchnulls,
amstorage,
amclusterable,
amkeytype,
amcanorderbyop,
ampredlocks
)
VALUES (
'bingo_idx',
'bingo_insert(internal, internal, internal, internal, internal)'::regprocedure::oid,
'bingo_beginscan(internal, internal, internal)'::regprocedure::oid,
'bingo_gettuple(internal, internal)'::regprocedure::oid,
0,
'bingo_rescan(internal, internal)'::regprocedure::oid,
'bingo_endscan(internal)'::regprocedure::oid,
'bingo_markpos(internal)'::regprocedure::oid,
'bingo_restrpos(internal)'::regprocedure::oid,
'bingo_build(internal, internal, internal)'::regprocedure::oid,
'bingo_bulkdelete(internal, internal, internal, internal)'::regprocedure::oid,
'bingo_vacuumcleanup(internal, internal)'::regprocedure::oid,
'bingo_costestimate(internal, internal, internal, internal, internal, internal, internal, internal)'::regprocedure::oid,
'bingo_options(_text, bool)'::regprocedure::oid,
'bingo_buildempty(internal)'::regprocedure::oid,
7,
7,
false,
true,
false,
false,
false,
false,
false,
false,
23,
false,
false
);

--**************************** MANGO OPERATOR CLASS *********************
CREATE OPERATOR CLASS molecule
FOR TYPE text USING bingo_idx
AS
        OPERATOR        1       public.@ (text, sub),
        OPERATOR        2       public.@ (text, exact),
        OPERATOR        3       public.@ (text, smarts),
        OPERATOR        4       public.@ (text, gross),
        OPERATOR        5       public.< (text, mass),
        OPERATOR        6       public.> (text, mass),
        OPERATOR        7       public.@ (text, sim),
        FUNCTION	1	matchSub(text, sub),
        FUNCTION	2	matchExact(text, exact),
        FUNCTION	3	matchSmarts(text, smarts),
        FUNCTION	4	matchGross(text, gross),
        FUNCTION	5	_match_mass_less(text, mass),
        FUNCTION	6	_match_mass_great(text, mass),
        FUNCTION	7	matchSim(text, sim);
		
		
CREATE OPERATOR CLASS bmolecule
FOR TYPE bytea USING bingo_idx
AS
        OPERATOR        1       public.@ (bytea, sub),
        OPERATOR        2       public.@ (bytea, exact),
        OPERATOR        3       public.@ (bytea, smarts),
        OPERATOR        4       public.@ (bytea, gross),
        OPERATOR        5       public.< (bytea, mass),
        OPERATOR        6       public.> (bytea, mass),
        OPERATOR        7       public.@ (bytea, sim),
        FUNCTION	1	matchSub(bytea, sub),
        FUNCTION	2	matchExact(bytea, exact),
        FUNCTION	3	matchSmarts(bytea, smarts),
        FUNCTION	4	matchGross(bytea, gross),
        FUNCTION	5	_match_mass_less(bytea, mass),
        FUNCTION	6	_match_mass_great(bytea, mass),
        FUNCTION	7	matchSim(bytea, sim);
        
--**************************** RINGO OPERATOR CLASS *********************
CREATE OPERATOR CLASS reaction
FOR TYPE text USING bingo_idx
AS
        OPERATOR        1       public.@ (text, rsub),
        OPERATOR        2       public.@ (text, rexact),
        OPERATOR        3       public.@ (text, rsmarts),
        FUNCTION	1	matchRSub(text, rsub),
        FUNCTION	2	matchRExact(text, rexact),
        FUNCTION	3	matchRSmarts(text, rsmarts);

CREATE OPERATOR CLASS breaction
FOR TYPE bytea USING bingo_idx
AS
        OPERATOR        1       public.@ (bytea, rsub),
        OPERATOR        2       public.@ (bytea, rexact),
        OPERATOR        3       public.@ (bytea, rsmarts),
        FUNCTION	1	matchRSub(bytea, rsub),
        FUNCTION	2	matchRExact(bytea, rexact),
        FUNCTION	3	matchRSmarts(bytea, rsmarts);
		


create table bingo_config(cname varchar(255), cvalue varchar(255));
insert into bingo_config(cname, cvalue) values ('TREAT_X_AS_PSEUDOATOM', '0');
insert into bingo_config(cname, cvalue) values ('IGNORE_CLOSING_BOND_DIRECTION_MISMATCH', '0');
insert into bingo_config(cname, cvalue) values ('FP_ORD_SIZE', '25');
insert into bingo_config(cname, cvalue) values ('FP_ANY_SIZE', '15');
insert into bingo_config(cname, cvalue) values ('FP_TAU_SIZE', '10');
insert into bingo_config(cname, cvalue) values ('FP_SIM_SIZE', '8');
insert into bingo_config(cname, cvalue) values ('SUB_SCREENING_MAX_BITS', '8');
insert into bingo_config(cname, cvalue) values ('SIM_SCREENING_PASS_MARK', '128');
insert into bingo_config(cname, cvalue) values ('NTHREADS', '-1');
insert into bingo_config(cname, cvalue) values ('TIMEOUT', '60000');


create table bingo_tau_config(rule_idx integer, tau_beg text, tau_end text);
insert into bingo_tau_config(rule_idx, tau_beg, tau_end) values (1, 'N,O,P,S,As,Se,Sb,Te', 'N,O,P,S,As,Se,Sb,Te');
insert into bingo_tau_config(rule_idx, tau_beg, tau_end) values (2, '0C', 'N,O,P,S');
insert into bingo_tau_config(rule_idx, tau_beg, tau_end) values (3, '1C', 'N,O');
COMMIT;

