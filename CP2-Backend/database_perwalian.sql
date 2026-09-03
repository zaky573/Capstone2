--
-- PostgreSQL database dump
--

\restrict RmXfZdSmcfKGp4wbB6t0AOkfsau2aQnMfDFJI9qc3DV7R8B2ads5piBANF1f2eC

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.perwalian DROP CONSTRAINT IF EXISTS perwalian_mahasiswa_id_foreign;
ALTER TABLE IF EXISTS ONLY public.mahasiswa DROP CONSTRAINT IF EXISTS mahasiswa_user_id_foreign;
ALTER TABLE IF EXISTS ONLY public.mahasiswa DROP CONSTRAINT IF EXISTS mahasiswa_dosen_wali_id_foreign;
ALTER TABLE IF EXISTS ONLY public.dosen DROP CONSTRAINT IF EXISTS dosen_user_id_foreign;
DROP INDEX IF EXISTS public.sessions_user_id_index;
DROP INDEX IF EXISTS public.sessions_last_activity_index;
DROP INDEX IF EXISTS public.perwalian_tahun_akademik_index;
DROP INDEX IF EXISTS public.perwalian_status_index;
DROP INDEX IF EXISTS public.personal_access_tokens_tokenable_type_tokenable_id_index;
DROP INDEX IF EXISTS public.personal_access_tokens_expires_at_index;
DROP INDEX IF EXISTS public.mahasiswa_program_studi_index;
DROP INDEX IF EXISTS public.mahasiswa_dosen_wali_id_index;
DROP INDEX IF EXISTS public.jobs_queue_index;
DROP INDEX IF EXISTS public.cache_locks_expiration_index;
DROP INDEX IF EXISTS public.cache_expiration_index;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_unique;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_unique;
ALTER TABLE IF EXISTS ONLY public.sessions DROP CONSTRAINT IF EXISTS sessions_pkey;
ALTER TABLE IF EXISTS ONLY public.perwalian DROP CONSTRAINT IF EXISTS perwalian_pkey;
ALTER TABLE IF EXISTS ONLY public.personal_access_tokens DROP CONSTRAINT IF EXISTS personal_access_tokens_token_unique;
ALTER TABLE IF EXISTS ONLY public.personal_access_tokens DROP CONSTRAINT IF EXISTS personal_access_tokens_pkey;
ALTER TABLE IF EXISTS ONLY public.password_reset_tokens DROP CONSTRAINT IF EXISTS password_reset_tokens_pkey;
ALTER TABLE IF EXISTS ONLY public.migrations DROP CONSTRAINT IF EXISTS migrations_pkey;
ALTER TABLE IF EXISTS ONLY public.mahasiswa DROP CONSTRAINT IF EXISTS mahasiswa_pkey;
ALTER TABLE IF EXISTS ONLY public.mahasiswa DROP CONSTRAINT IF EXISTS mahasiswa_nim_unique;
ALTER TABLE IF EXISTS ONLY public.jobs DROP CONSTRAINT IF EXISTS jobs_pkey;
ALTER TABLE IF EXISTS ONLY public.job_batches DROP CONSTRAINT IF EXISTS job_batches_pkey;
ALTER TABLE IF EXISTS ONLY public.failed_jobs DROP CONSTRAINT IF EXISTS failed_jobs_uuid_unique;
ALTER TABLE IF EXISTS ONLY public.failed_jobs DROP CONSTRAINT IF EXISTS failed_jobs_pkey;
ALTER TABLE IF EXISTS ONLY public.dosen DROP CONSTRAINT IF EXISTS dosen_pkey;
ALTER TABLE IF EXISTS ONLY public.dosen DROP CONSTRAINT IF EXISTS dosen_nidn_unique;
ALTER TABLE IF EXISTS ONLY public.cache DROP CONSTRAINT IF EXISTS cache_pkey;
ALTER TABLE IF EXISTS ONLY public.cache_locks DROP CONSTRAINT IF EXISTS cache_locks_pkey;
ALTER TABLE IF EXISTS public.users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.perwalian ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.personal_access_tokens ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.migrations ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.mahasiswa ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.jobs ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.failed_jobs ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.dosen ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.users_id_seq;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.sessions;
DROP SEQUENCE IF EXISTS public.perwalian_id_seq;
DROP TABLE IF EXISTS public.perwalian;
DROP SEQUENCE IF EXISTS public.personal_access_tokens_id_seq;
DROP TABLE IF EXISTS public.personal_access_tokens;
DROP TABLE IF EXISTS public.password_reset_tokens;
DROP SEQUENCE IF EXISTS public.migrations_id_seq;
DROP TABLE IF EXISTS public.migrations;
DROP SEQUENCE IF EXISTS public.mahasiswa_id_seq;
DROP TABLE IF EXISTS public.mahasiswa;
DROP SEQUENCE IF EXISTS public.jobs_id_seq;
DROP TABLE IF EXISTS public.jobs;
DROP TABLE IF EXISTS public.job_batches;
DROP SEQUENCE IF EXISTS public.failed_jobs_id_seq;
DROP TABLE IF EXISTS public.failed_jobs;
DROP SEQUENCE IF EXISTS public.dosen_id_seq;
DROP TABLE IF EXISTS public.dosen;
DROP TABLE IF EXISTS public.cache_locks;
DROP TABLE IF EXISTS public.cache;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cache; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cache (
    key character varying(255) NOT NULL,
    value text NOT NULL,
    expiration integer NOT NULL
);


--
-- Name: cache_locks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cache_locks (
    key character varying(255) NOT NULL,
    owner character varying(255) NOT NULL,
    expiration integer NOT NULL
);


--
-- Name: dosen; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dosen (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    nidn character varying(20) NOT NULL,
    nama_lengkap character varying(255) NOT NULL,
    jenis_kelamin character varying(255) NOT NULL,
    no_hp character varying(20),
    alamat text,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    tempat_lahir character varying(100),
    tanggal_lahir date,
    pendidikan_jurusan character varying(150),
    pendidikan_universitas character varying(200),
    CONSTRAINT dosen_jenis_kelamin_check CHECK (((jenis_kelamin)::text = ANY ((ARRAY['L'::character varying, 'P'::character varying])::text[])))
);


--
-- Name: dosen_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.dosen_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: dosen_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.dosen_id_seq OWNED BY public.dosen.id;


--
-- Name: failed_jobs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.failed_jobs (
    id bigint NOT NULL,
    uuid character varying(255) NOT NULL,
    connection text NOT NULL,
    queue text NOT NULL,
    payload text NOT NULL,
    exception text NOT NULL,
    failed_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: failed_jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.failed_jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: failed_jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.failed_jobs_id_seq OWNED BY public.failed_jobs.id;


--
-- Name: job_batches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.job_batches (
    id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    total_jobs integer NOT NULL,
    pending_jobs integer NOT NULL,
    failed_jobs integer NOT NULL,
    failed_job_ids text NOT NULL,
    options text,
    cancelled_at integer,
    created_at integer NOT NULL,
    finished_at integer
);


--
-- Name: jobs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.jobs (
    id bigint NOT NULL,
    queue character varying(255) NOT NULL,
    payload text NOT NULL,
    attempts smallint NOT NULL,
    reserved_at integer,
    available_at integer NOT NULL,
    created_at integer NOT NULL
);


--
-- Name: jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.jobs_id_seq OWNED BY public.jobs.id;


--
-- Name: mahasiswa; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mahasiswa (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    nim character varying(20) NOT NULL,
    nama_lengkap character varying(255) NOT NULL,
    jenis_kelamin character varying(255) NOT NULL,
    program_studi character varying(255) NOT NULL,
    angkatan smallint NOT NULL,
    semester smallint NOT NULL,
    status_akademik character varying(20) DEFAULT 'Aktif'::character varying NOT NULL,
    no_hp character varying(20),
    alamat text,
    dosen_wali_id bigint,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    tempat_lahir character varying(100),
    tanggal_lahir date,
    CONSTRAINT mahasiswa_jenis_kelamin_check CHECK (((jenis_kelamin)::text = ANY ((ARRAY['L'::character varying, 'P'::character varying])::text[])))
);


--
-- Name: mahasiswa_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.mahasiswa_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: mahasiswa_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.mahasiswa_id_seq OWNED BY public.mahasiswa.id;


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    migration character varying(255) NOT NULL,
    batch integer NOT NULL
);


--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.password_reset_tokens (
    email character varying(255) NOT NULL,
    token character varying(255) NOT NULL,
    created_at timestamp(0) without time zone
);


--
-- Name: personal_access_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.personal_access_tokens (
    id bigint NOT NULL,
    tokenable_type character varying(255) NOT NULL,
    tokenable_id bigint NOT NULL,
    name text NOT NULL,
    token character varying(64) NOT NULL,
    abilities text,
    last_used_at timestamp(0) without time zone,
    expires_at timestamp(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.personal_access_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.personal_access_tokens_id_seq OWNED BY public.personal_access_tokens.id;


--
-- Name: perwalian; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.perwalian (
    id bigint NOT NULL,
    mahasiswa_id bigint NOT NULL,
    tahun_akademik character varying(9) NOT NULL,
    semester character varying(255) NOT NULL,
    uraian text NOT NULL,
    kendala text,
    rencana_studi text,
    komentar_dosen text,
    status character varying(255) DEFAULT 'menunggu_verifikasi'::character varying NOT NULL,
    verified_at timestamp(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    tanggal_ketemu character varying(10),
    jam_ketemu character varying(5),
    lokasi_pertemuan character varying(255),
    catatan_jadwal text,
    CONSTRAINT perwalian_semester_check CHECK (((semester)::text = ANY ((ARRAY['ganjil'::character varying, 'genap'::character varying])::text[]))),
    CONSTRAINT perwalian_status_check CHECK (((status)::text = ANY ((ARRAY['menunggu_verifikasi'::character varying, 'diverifikasi'::character varying, 'selesai'::character varying])::text[])))
);


--
-- Name: perwalian_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.perwalian_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: perwalian_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.perwalian_id_seq OWNED BY public.perwalian.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    id character varying(255) NOT NULL,
    user_id bigint,
    ip_address character varying(45),
    user_agent text,
    payload text NOT NULL,
    last_activity integer NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255),
    password character varying(255) NOT NULL,
    role character varying(255) DEFAULT 'mahasiswa'::character varying NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    must_change_password boolean DEFAULT false NOT NULL,
    email_verified_at timestamp(0) without time zone,
    last_login_at timestamp(0) without time zone,
    remember_token character varying(100),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'dosen'::character varying, 'mahasiswa'::character varying])::text[])))
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: dosen id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dosen ALTER COLUMN id SET DEFAULT nextval('public.dosen_id_seq'::regclass);


--
-- Name: failed_jobs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.failed_jobs ALTER COLUMN id SET DEFAULT nextval('public.failed_jobs_id_seq'::regclass);


--
-- Name: jobs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs ALTER COLUMN id SET DEFAULT nextval('public.jobs_id_seq'::regclass);


--
-- Name: mahasiswa id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mahasiswa ALTER COLUMN id SET DEFAULT nextval('public.mahasiswa_id_seq'::regclass);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: personal_access_tokens id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personal_access_tokens ALTER COLUMN id SET DEFAULT nextval('public.personal_access_tokens_id_seq'::regclass);


--
-- Name: perwalian id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.perwalian ALTER COLUMN id SET DEFAULT nextval('public.perwalian_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: cache; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cache (key, value, expiration) FROM stdin;
sistem-perwalian-stmik-bandung-cache-5c785c036466adea360111aa28563bfd556b5fba:timer	i:1788174355;	1788174355
sistem-perwalian-stmik-bandung-cache-5c785c036466adea360111aa28563bfd556b5fba	i:1;	1788174355
\.


--
-- Data for Name: cache_locks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cache_locks (key, owner, expiration) FROM stdin;
\.


--
-- Data for Name: dosen; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.dosen (id, user_id, nidn, nama_lengkap, jenis_kelamin, no_hp, alamat, created_at, updated_at, tempat_lahir, tanggal_lahir, pendidikan_jurusan, pendidikan_universitas) FROM stdin;
47	70	0401057801	Dr. Ahmad Fauzi, M.T.	L	081220123456	Jl. Dago No. 120, Bandung	2026-08-27 20:36:35	2026-08-27 20:36:35	Bandung	1978-05-01	S3 - Teknik Informatika	Institut Teknologi Bandung
48	71	0415088202	Dr. Rina Novita, S.Kom., M.T.	P	081321654987	Jl. Buah Batu No. 45, Bandung	2026-08-27 20:36:35	2026-08-27 20:36:35	Jakarta	1982-08-15	S3 - Sistem Informasi	Universitas Indonesia
49	72	0420118503	Budi Raharjo, M.Kom.	L	081572001122	Jl. Setiabudhi No. 88, Bandung	2026-08-27 20:36:35	2026-08-27 20:36:35	Semarang	1985-11-20	S2 - Teknik Komputer	Universitas Gadjah Mada
50	73	0410037904	Dewi Kusuma, M.T.	P	081234567801	Jl. Riau No. 14, Bandung	2026-08-27 20:36:35	2026-08-27 20:36:35	Yogyakarta	1979-03-10	S2 - Teknik Informatika	Institut Teknologi Sepuluh Nopember
51	74	0405078105	Eko Prasetyo, S.T., M.Kom.	L	081398765432	Jl. Sukajadi No. 32, Bandung	2026-08-27 20:36:35	2026-08-27 20:36:35	Surabaya	1981-07-05	S2 - Ilmu Komputer	Universitas Padjadjaran
52	75	0412128706	Fitriani Lestari, M.Si.	P	081765432109	Jl. Ciumbuleuit No. 77, Bandung	2026-08-27 20:36:35	2026-08-27 20:36:35	Bogor	1987-12-12	S2 - Sistem Informasi	Universitas Telkom
53	76	0425018307	Hendra Wijaya, M.T.	L	081809123456	Jl. Asia Afrika No. 90, Bandung	2026-08-27 20:36:35	2026-08-27 20:36:35	Bandung	1983-01-25	S2 - Teknik Elektro	Institut Teknologi Bandung
54	77	0414068908	Indah Permata, M.Kom.	P	081910293847	Jl. Burangrang No. 15, Bandung	2026-08-27 20:36:35	2026-08-27 20:36:35	Malang	1989-06-14	S2 - Teknik Informatika	Universitas Brawijaya
55	78	0408107609	Dr. Joko Susilo, M.Sc.	L	081122334455	Jl. Padalarang No. 5, Bandung	2026-08-27 20:36:35	2026-08-27 20:36:35	Solo	1976-10-08	S3 - Ilmu Komputer	Universitas Gadjah Mada
56	79	0404048810	Kartika Sari, S.Kom., M.T.	P	081299887766	Jl. Gatot Subroto No. 50, Bandung	2026-08-27 20:36:35	2026-08-27 20:36:35	Cirebon	1988-04-04	S2 - Sistem Informasi	Universitas Indonesia
\.


--
-- Data for Name: failed_jobs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.failed_jobs (id, uuid, connection, queue, payload, exception, failed_at) FROM stdin;
\.


--
-- Data for Name: job_batches; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.job_batches (id, name, total_jobs, pending_jobs, failed_jobs, failed_job_ids, options, cancelled_at, created_at, finished_at) FROM stdin;
\.


--
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.jobs (id, queue, payload, attempts, reserved_at, available_at, created_at) FROM stdin;
\.


--
-- Data for Name: mahasiswa; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.mahasiswa (id, user_id, nim, nama_lengkap, jenis_kelamin, program_studi, angkatan, semester, status_akademik, no_hp, alamat, dosen_wali_id, created_at, updated_at, tempat_lahir, tanggal_lahir) FROM stdin;
212	84	202502001	Irfan Hidayat	L	Sistem Informasi	2025	2	Aktif	0824162558	Jl. Pahlawan No. 144, Bogor	52	2026-08-27 20:36:53	2026-08-27 20:36:53	Bogor	2007-03-05
213	85	202301002	Yulia Nugroho	P	Teknik Informatika	2023	6	Aktif	0866243586	Jl. Gatot Subroto No. 18, Bandung	47	2026-08-27 20:36:53	2026-08-27 20:36:53	Bogor	2003-08-04
214	86	202301003	Zul Kusuma	L	Teknik Informatika	2023	6	Aktif	0848805583	Jl. Ahmad Yani No. 68, Tangerang	54	2026-08-27 20:36:53	2026-08-27 20:36:53	Bandung	2004-06-17
215	87	202401004	Wahyu Hapsari	L	Teknik Informatika	2024	4	Aktif	0861940065	Jl. Buah Batu No. 138, Cirebon	54	2026-08-27 20:36:53	2026-08-27 20:36:53	Tasikmalaya	2004-10-27
216	88	202201005	Lestari Firmansyah	P	Teknik Informatika	2022	8	Aktif	0821897794	Jl. Riau No. 44, Bogor	54	2026-08-27 20:36:53	2026-08-27 20:36:53	Bogor	2002-07-03
217	89	202201006	Tari Wibowo	P	Teknik Informatika	2022	8	Aktif	0886244490	Jl. Sudirman No. 4, Bogor	47	2026-08-27 20:36:53	2026-08-27 20:36:53	Semarang	2003-09-17
218	90	202302007	Putri Hapsari	P	Sistem Informasi	2023	6	Aktif	0833351978	Jl. Ahmad Yani No. 97, Tasikmalaya	54	2026-08-27 20:36:53	2026-08-27 20:36:53	Tangerang	2005-01-05
219	91	202402008	Andi Saputra	L	Sistem Informasi	2024	4	Aktif	0866788710	Jl. Dago No. 17, Depok	53	2026-08-27 20:36:53	2026-08-27 20:36:53	Bogor	2004-02-03
220	92	202202009	Setyo Permana	L	Sistem Informasi	2022	8	Aktif	0814628343	Jl. Ahmad Yani No. 9, Tasikmalaya	47	2026-08-27 20:36:53	2026-08-27 20:36:53	Depok	2003-07-12
221	93	202302010	Naufal Hidayat	L	Sistem Informasi	2023	6	Aktif	0896484920	Jl. Buah Batu No. 15, Tasikmalaya	49	2026-08-27 20:36:53	2026-08-27 20:36:53	Depok	2004-09-10
222	94	202302011	Maya Setiawan	P	Sistem Informasi	2023	6	Aktif	0877295890	Jl. Asia Afrika No. 99, Bekasi	47	2026-08-27 20:36:53	2026-08-27 20:36:53	Bandung	2003-03-15
223	95	202502012	Olivia Subagyo	P	Sistem Informasi	2025	2	Aktif	0865146230	Jl. Pahlawan No. 84, Depok	55	2026-08-27 20:36:53	2026-08-27 20:36:53	Depok	2005-03-11
224	96	202302013	Setyo Setiawan	L	Sistem Informasi	2023	6	Aktif	0822545274	Jl. Setiabudhi No. 53, Bogor	48	2026-08-27 20:36:53	2026-08-27 20:36:53	Yogyakarta	2004-01-17
225	97	202201014	Rizky Wijaya	L	Teknik Informatika	2022	8	Aktif	0845478320	Jl. Diponegoro No. 82, Jakarta	55	2026-08-27 20:36:53	2026-08-27 20:36:53	Bogor	2002-09-05
226	98	202501015	Pratama Suryadi	L	Teknik Informatika	2025	2	Aktif	0843896453	Jl. Gatot Subroto No. 58, Depok	56	2026-08-27 20:36:53	2026-08-27 20:36:53	Surabaya	2005-11-01
227	99	202201016	Kartika Handoko	P	Teknik Informatika	2022	8	Aktif	0857854956	Jl. Buah Batu No. 108, Bogor	50	2026-08-27 20:36:53	2026-08-27 20:36:53	Bogor	2004-08-11
228	100	202502017	Muhammad Pratama	L	Sistem Informasi	2025	2	Aktif	0875534932	Jl. Pahlawan No. 97, Bogor	55	2026-08-27 20:36:53	2026-08-27 20:36:53	Jakarta	2006-02-09
229	101	202202018	Bunga Permana	P	Sistem Informasi	2022	8	Aktif	0849276069	Jl. Diponegoro No. 84, Semarang	54	2026-08-27 20:36:53	2026-08-27 20:36:53	Cirebon	2003-05-27
230	102	202402019	Hana Siregar	P	Sistem Informasi	2024	4	Aktif	0817398525	Jl. Merdeka No. 110, Cirebon	55	2026-08-27 20:36:53	2026-08-27 20:36:53	Tangerang	2004-03-16
231	103	202302020	Pratama Gunawan	L	Sistem Informasi	2023	6	Aktif	0858461886	Jl. Merdeka No. 119, Depok	47	2026-08-27 20:36:53	2026-08-27 20:36:53	Cimahi	2004-12-19
232	104	202301021	Zahra Permana	P	Teknik Informatika	2023	6	Aktif	0843567031	Jl. Gatot Subroto No. 92, Bekasi	49	2026-08-27 20:36:53	2026-08-27 20:36:53	Bandung	2003-01-16
233	105	202301022	Budi Saputra	L	Teknik Informatika	2023	6	Aktif	0849918969	Jl. Setiabudhi No. 73, Depok	55	2026-08-27 20:36:53	2026-08-27 20:36:53	Jakarta	2005-08-20
234	106	202202023	Gita Firmansyah	P	Sistem Informasi	2022	8	Aktif	0863834924	Jl. Merdeka No. 146, Bekasi	52	2026-08-27 20:36:53	2026-08-27 20:36:53	Tasikmalaya	2002-07-17
235	107	202301024	Pratama Kusuma	L	Teknik Informatika	2023	6	Aktif	0841161541	Jl. Setiabudhi No. 19, Bekasi	52	2026-08-27 20:36:53	2026-08-27 20:36:53	Bandung	2005-07-21
236	108	202502025	Budi Nugroho	L	Sistem Informasi	2025	2	Aktif	0834598324	Jl. Riau No. 84, Semarang	49	2026-08-27 20:36:53	2026-08-27 20:36:53	Depok	2007-12-12
237	109	202302026	Hana Ramadhan	P	Sistem Informasi	2023	6	Aktif	0861409559	Jl. Dago No. 128, Bandung	48	2026-08-27 20:36:53	2026-08-27 20:36:53	Yogyakarta	2005-08-24
238	110	202401027	Deni Siregar	L	Teknik Informatika	2024	4	Aktif	0867953355	Jl. Riau No. 93, Semarang	48	2026-08-27 20:36:53	2026-08-27 20:36:53	Bekasi	2006-02-17
239	111	202302028	Zahra Hidayat	P	Sistem Informasi	2023	6	Aktif	0834786126	Jl. Ahmad Yani No. 36, Bandung	48	2026-08-27 20:36:53	2026-08-27 20:36:53	Surabaya	2005-06-02
240	112	202501029	Hendra Siregar	L	Teknik Informatika	2025	2	Aktif	0895763017	Jl. Merdeka No. 39, Jakarta	47	2026-08-27 20:36:53	2026-08-27 20:36:53	Tangerang	2005-02-05
241	113	202301030	Olivia Wijaya	P	Teknik Informatika	2023	6	Aktif	0866659495	Jl. Asia Afrika No. 23, Cirebon	53	2026-08-27 20:36:53	2026-08-27 20:36:53	Bandung	2004-06-22
242	114	202201031	Hana Pratama	P	Teknik Informatika	2022	8	Aktif	0825509046	Jl. Setiabudhi No. 33, Depok	55	2026-08-27 20:36:53	2026-08-27 20:36:53	Tasikmalaya	2004-10-25
243	115	202402032	Nabila Gunawan	P	Sistem Informasi	2024	4	Aktif	0891313463	Jl. Merdeka No. 75, Bogor	52	2026-08-27 20:36:54	2026-08-27 20:36:54	Bogor	2004-01-26
244	116	202202033	Yoga Utami	L	Sistem Informasi	2022	8	Aktif	0834633566	Jl. Dago No. 137, Semarang	50	2026-08-27 20:36:54	2026-08-27 20:36:54	Bekasi	2002-11-03
245	117	202502034	Bayu Setiawan	L	Sistem Informasi	2025	2	Aktif	0847992330	Jl. Gatot Subroto No. 7, Yogyakarta	49	2026-08-27 20:36:54	2026-08-27 20:36:54	Sukabumi	2007-11-22
246	118	202201035	Lukman Lestari	L	Teknik Informatika	2022	8	Aktif	0888266144	Jl. Dago No. 19, Bogor	51	2026-08-27 20:36:54	2026-08-27 20:36:54	Bandung	2003-06-05
247	119	202401036	Citra Kurniawan	P	Teknik Informatika	2024	4	Aktif	0896976425	Jl. Sudirman No. 74, Tasikmalaya	54	2026-08-27 20:36:54	2026-08-27 20:36:54	Tasikmalaya	2004-11-10
248	120	202201037	Andi Hidayat	L	Teknik Informatika	2022	8	Aktif	0867736155	Jl. Buah Batu No. 47, Surabaya	50	2026-08-27 20:36:54	2026-08-27 20:36:54	Bekasi	2004-07-07
249	121	202201038	Naufal Kusuma	L	Teknik Informatika	2022	8	Aktif	0879536963	Jl. Asia Afrika No. 100, Yogyakarta	56	2026-08-27 20:36:54	2026-08-27 20:36:54	Jakarta	2004-02-26
250	122	202201039	Indah Handoko	P	Teknik Informatika	2022	8	Aktif	0850610286	Jl. Pahlawan No. 87, Bandung	50	2026-08-27 20:36:54	2026-08-27 20:36:54	Cirebon	2004-05-10
251	123	202202040	Gita Suryadi	P	Sistem Informasi	2022	8	Aktif	0819352231	Jl. Buah Batu No. 13, Depok	50	2026-08-27 20:36:54	2026-08-27 20:36:54	Semarang	2004-08-19
252	124	202401041	Tari Ramadhan	P	Teknik Informatika	2024	4	Aktif	0838246966	Jl. Merdeka No. 137, Yogyakarta	47	2026-08-27 20:36:54	2026-08-27 20:36:54	Sukabumi	2006-04-22
253	125	202201042	Yoga Firmansyah	L	Teknik Informatika	2022	8	Aktif	0863874188	Jl. Gatot Subroto No. 86, Cirebon	53	2026-08-27 20:36:54	2026-08-27 20:36:54	Surabaya	2002-11-13
254	126	202301043	Candra Pratama	L	Teknik Informatika	2023	6	Aktif	0895322794	Jl. Diponegoro No. 78, Bogor	51	2026-08-27 20:36:54	2026-08-27 20:36:54	Depok	2004-12-09
255	127	202201044	Fitri Gunawan	P	Teknik Informatika	2022	8	Aktif	0885335976	Jl. Diponegoro No. 26, Tangerang	55	2026-08-27 20:36:54	2026-08-27 20:36:54	Cirebon	2004-11-26
256	128	202402045	Anisa Setiawan	P	Sistem Informasi	2024	4	Aktif	0858565678	Jl. Diponegoro No. 87, Semarang	56	2026-08-27 20:36:54	2026-08-27 20:36:54	Surabaya	2006-06-02
257	129	202501046	Pratama Setiawan	L	Teknik Informatika	2025	2	Aktif	0824219339	Jl. Diponegoro No. 99, Surabaya	54	2026-08-27 20:36:54	2026-08-27 20:36:54	Depok	2005-12-04
258	130	202502047	Yoga Firmansyah	L	Sistem Informasi	2025	2	Aktif	0851781993	Jl. Riau No. 87, Cirebon	47	2026-08-27 20:36:54	2026-08-27 20:36:54	Tangerang	2007-04-04
259	131	202301048	Lukman Pratama	L	Teknik Informatika	2023	6	Aktif	0894374097	Jl. Buah Batu No. 103, Sukabumi	55	2026-08-27 20:36:54	2026-08-27 20:36:54	Tasikmalaya	2005-09-08
260	132	202202049	Dimas Suryadi	L	Sistem Informasi	2022	8	Aktif	0830553354	Jl. Buah Batu No. 130, Cirebon	54	2026-08-27 20:36:54	2026-08-27 20:36:54	Tangerang	2004-02-14
261	133	202502050	Kartika Pratama	P	Sistem Informasi	2025	2	Aktif	0822636266	Jl. Ahmad Yani No. 4, Jakarta	52	2026-08-27 20:36:54	2026-08-27 20:36:54	Bandung	2005-06-12
262	134	1224067	Ahmad Yani	L	Teknik Informatika	2024	1	Aktif	081234567890	Jl. Merdeka No. 1, Bandung	\N	2026-08-31 10:41:20	2026-08-31 10:41:20	Bandung	2004-05-15
263	135	1228934	Siti Nurhaliza jaze	P	Sistem Informasi	2024	1	Aktif	081234567891	Jl. Sudirman No. 10, Bandung	\N	2026-08-31 10:41:21	2026-08-31 10:41:21	Jakarta	2004-08-20
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.migrations (id, migration, batch) FROM stdin;
1	0001_01_01_000000_create_users_table	1
2	0001_01_01_000001_create_cache_table	1
3	0001_01_01_000002_create_jobs_table	1
4	2026_01_01_000001_create_dosen_table	1
5	2026_01_01_000002_create_mahasiswa_table	1
6	2026_01_01_000003_create_perwalian_table	1
7	2026_01_01_000004_drop_program_studi_from_dosen_table	1
8	2026_08_10_085446_create_personal_access_tokens_table	1
9	2026_01_01_000010_add_jadwal_fields_to_perwalian_table	2
10	2026_01_01_000011_add_profile_fields_to_mahasiswa_table	3
11	2026_01_01_000012_add_profile_fields_to_dosen_table	3
\.


--
-- Data for Name: password_reset_tokens; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.password_reset_tokens (email, token, created_at) FROM stdin;
\.


--
-- Data for Name: personal_access_tokens; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.personal_access_tokens (id, tokenable_type, tokenable_id, name, token, abilities, last_used_at, expires_at, created_at, updated_at) FROM stdin;
4	App\\Models\\User	1	auth-token	7eb3d97fb82269605a377f2dd1159fb2da772cc0d8524ab3f99d2088f37b149c	["*"]	2026-08-26 21:14:19	\N	2026-08-26 21:14:18	2026-08-26 21:14:19
5	App\\Models\\User	1	auth-token	17952735c2f1bc539586b41bb02e39dfb011e43e6018d52ab83e875e2ace8356	["*"]	2026-08-26 21:14:51	\N	2026-08-26 21:14:51	2026-08-26 21:14:51
13	App\\Models\\User	1	auth-token	204ff0b58ee3bb55908691f5787c93dc0a43c9ca0f04d3dc644f2058e312fcc7	["*"]	\N	\N	2026-08-27 12:28:34	2026-08-27 12:28:34
14	App\\Models\\User	9	auth-token	1785bcc4f3dee8f55e717614efc2c4ec32b6d761f9bf44629edabf1826376997	["*"]	2026-08-27 12:29:44	\N	2026-08-27 12:29:44	2026-08-27 12:29:44
2	App\\Models\\User	1	auth-token	014fe7b37cb6a5cabaabbf209767726746233fe5ddf3c1c0ca396685846a50c1	["*"]	\N	\N	2026-08-26 20:50:36	2026-08-26 20:50:36
3	App\\Models\\User	1	auth-token	310f011d1936c1522be2e6e1b9d9fdd7f44afaf40031c7135ab4bff5d76a1194	["*"]	2026-08-26 20:51:47	\N	2026-08-26 20:51:46	2026-08-26 20:51:47
15	App\\Models\\User	9	auth-token	75e3d13371d425037be37e120debb7f7b49986d3ab9f368f9c864accab45e67d	["*"]	2026-08-27 12:30:35	\N	2026-08-27 12:30:35	2026-08-27 12:30:35
16	App\\Models\\User	9	auth-token	0de9aebcfb3f5706c8455b5899f3dbb3586d513b54e1fd638cd44982db1c24cb	["*"]	2026-08-27 12:31:07	\N	2026-08-27 12:31:06	2026-08-27 12:31:07
17	App\\Models\\User	9	auth-token	10ac7987dd05e562953c168b2f151bdc09080ef9e78ad9c69359cc13688bc8ae	["*"]	2026-08-27 12:32:15	\N	2026-08-27 12:32:14	2026-08-27 12:32:15
102	App\\Models\\User	70	auth-token	baed9d02a9cb2ee9762851882013da80c637e4745b19a1e7cff1c2d8f3c3cf2a	["*"]	2026-08-31 18:59:10	\N	2026-08-31 11:04:55	2026-08-31 18:59:10
\.


--
-- Data for Name: perwalian; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.perwalian (id, mahasiswa_id, tahun_akademik, semester, uraian, kendala, rencana_studi, komentar_dosen, status, verified_at, created_at, updated_at, tanggal_ketemu, jam_ketemu, lokasi_pertemuan, catatan_jadwal) FROM stdin;
14	213	2025/2026	ganjil	Saya mengalami kesulitan dalam memahami beberapa mata kuliah pada semester sebelumnya dan ingin meminta saran mengenai cara meningkatkan hasil belajar.	\N	\N	\N	menunggu_verifikasi	\N	2026-08-27 22:53:42	2026-08-27 22:53:42	\N	\N	\N	\N
15	213	2024/2025	genap	Saya ingin berkonsultasi mengenai hasil KHS semester sebelumnya dan meminta arahan terkait evaluasi nilai yang saya peroleh.	\N	\N	\N	menunggu_verifikasi	\N	2026-08-28 07:01:27	2026-08-28 07:01:27	\N	\N	\N	\N
16	216	2026/2027	ganjil	Saya ingin meminta arahan mengenai pengambilan jumlah SKS pada semester ini agar beban perkuliahan yang diambil dapat saya jalani dengan baik.	\N	\N	\N	menunggu_verifikasi	\N	2026-08-28 07:05:10	2026-08-28 07:05:10	\N	\N	\N	\N
17	218	2025/2026	genap	Saya mengalami kendala dalam mengatur waktu antara kegiatan perkuliahan dan kegiatan organisasi, sehingga ingin meminta saran dalam mengatur prioritas.	\N	\N	\N	menunggu_verifikasi	\N	2026-08-28 07:05:52	2026-08-28 07:05:52	\N	\N	\N	\N
18	218	2023/2024	ganjil	Saya ingin berkonsultasi mengenai mata kuliah yang perlu saya ulang serta rencana pengambilannya pada semester berikutnya.	\N	\N	\N	menunggu_verifikasi	\N	2026-08-28 07:06:11	2026-08-28 07:06:11	\N	\N	\N	\N
19	220	2023/2024	ganjil	Saya ingin berkonsultasi mengenai persiapan untuk mengikuti program magang dan meminta arahan terkait hal-hal yang perlu dipersiapkan.	\N	\N	\N	menunggu_verifikasi	\N	2026-08-28 07:08:09	2026-08-28 07:08:09	\N	\N	\N	\N
20	223	2025/2026	ganjil	Saya ingin meminta saran mengenai peminatan atau bidang yang sesuai dengan minat dan kemampuan saya untuk mendukung rencana karier ke depannya.	\N	\N	\N	menunggu_verifikasi	\N	2026-08-28 07:09:03	2026-08-28 07:09:03	\N	\N	\N	\N
22	232	2025/2026	ganjil	Saya ingin berkonsultasi mengenai mata kuliah yang sebaiknya saya ambil pada semester ini agar sesuai dengan kemampuan dan rencana studi saya.	\N	\N	\N	menunggu_verifikasi	\N	2026-08-28 07:28:42	2026-08-28 07:28:42	\N	\N	\N	\N
21	227	2023/2024	ganjil	Saya ingin berkonsultasi mengenai rencana studi pada semester berikutnya, terutama terkait mata kuliah yang memiliki prasyarat dan harus diprioritaskan.	\N	\N	okey lanjut di wa aja	selesai	2026-08-28 07:45:06	2026-08-28 07:16:40	2026-08-28 07:45:06	2026-09-10	10:30	ruangan 33	saya tunggu di ruangan
23	221	2025/2026	genap	Saya mengalami kesulitan dalam memahami beberapa mata kuliah pada semester sebelumnya dan ingin meminta saran mengenai cara meningkatkan hasil belajar.	\N	\N	\N	selesai	2026-08-31 09:27:18	2026-08-28 07:30:24	2026-08-31 09:27:18	2026-10-20	10:30	kantin	ditunggu
25	246	2023/2024	ganjil	Saya ingin berkonsultasi mengenai mata kuliah yang perlu saya ulang serta rencana pengambilannya pada semester berikutnya.	\N	\N	okey	selesai	2026-08-28 07:47:30	2026-08-28 07:38:01	2026-08-28 07:47:30	2026-10-10	10:10	ruangan 33	saya tunggu 15 menit sebelum kelas
27	226	2026/2027	ganjil	Saya ingin melakukan konsultasi terkait perwalian dan rencana pengambilan mata kuliah pada semester ini. Saya ingin meminta arahan mengenai mata kuliah yang sebaiknya saya ambil agar sesuai dengan rencana studi saya. Terima kasih.	\N	\N	\N	menunggu_verifikasi	\N	2026-08-30 14:07:44	2026-08-30 14:07:44	\N	\N	\N	\N
13	226	2025/2026	ganjil	Saya ingin berkonsultasi mengenai mata kuliah yang sebaiknya saya ambil pada semester ini agar sesuai dengan kemampuan dan rencana studi saya.	\N	\N	saya tunggu	selesai	2026-08-30 14:12:41	2026-08-27 21:45:11	2026-08-30 14:12:53	2026-02-10	10:30	Ruangan 25	sesudah kelas langsung ke ruangan 25
26	226	2025/2026	ganjil	Saya ingin berkonsultasi terkait perwalian dan pengambilan mata kuliah untuk semester ini	\N	\N	\N	diverifikasi	2026-08-30 14:18:35	2026-08-30 14:06:59	2026-08-30 14:18:35	0026-03-10	19:30	zoom	pertemuannya online sesudah sholat isyaa
28	226	2026/2027	genap	erhsge	\N	\N	\N	menunggu_verifikasi	\N	2026-08-31 08:03:18	2026-08-31 08:03:18	\N	\N	\N	\N
24	221	2026/2027	ganjil	Saya ingin berkonsultasi mengenai hasil KHS semester sebelumnya dan meminta arahan terkait evaluasi nilai yang saya peroleh.	\N	\N	\N	diverifikasi	2026-08-31 09:26:35	2026-08-28 07:30:48	2026-08-31 09:26:35	2026-10-10	10:30	taman sumarecon	ditunggu
29	226	2026/2027	ganjil	Saya ingin menanyakan masalah keuangan	\N	\N	\N	menunggu_verifikasi	\N	2026-08-31 10:50:08	2026-08-31 10:50:08	\N	\N	\N	\N
30	223	2026/2027	ganjil	Saya ingin menanyakan masalah keuangan	\N	\N	\N	selesai	2026-08-31 10:59:22	2026-08-31 10:54:37	2026-08-31 10:59:22	2026-09-01	13:00	lobby	harap konfirmasi ke bagian layanan keuangan kampus
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sessions (id, user_id, ip_address, user_agent, payload, last_activity) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, username, email, password, role, is_active, must_change_password, email_verified_at, last_login_at, remember_token, created_at, updated_at) FROM stdin;
99	202201016	kartika.handoko16@yahoo.co.id	$2y$12$Z7utYMHx8p.B5T/knEGLq.rMXG/YOEYuVvEDHyXn/DVIVRh7HFnr.	mahasiswa	t	t	\N	2026-08-28 07:43:59	\N	2026-08-27 19:46:18	2026-08-28 07:43:59
3	0417048202	sitirahmawati,mt@stmik-bandung.ac.id	$2y$12$L0LsS10CQ8FKe6JWdJqbY./n272e1S.gQQyPzVzlZdQ9Nd9Q3hKQ6	dosen	t	f	\N	\N	\N	2026-08-24 11:52:18	2026-08-24 11:52:18
4	0401057803	asepsaepudin,skom,mkom@stmik-bandung.ac.id	$2y$12$3kcPP3VkS0Af9.3HCOEqPemAxOOI0oJnbXvFOaPBFzKnNWvEFITgG	dosen	t	f	\N	\N	\N	2026-08-24 11:52:18	2026-08-24 11:52:18
6	211102002	bellaanggraini@student.stmik-bandung.ac.id	$2y$12$rgh3WnW1lp39H2aj5gYHHu7pVW9Jzbk7GU9dhyORHp7/x.4n4d0m.	mahasiswa	t	f	\N	\N	\N	2026-08-24 11:52:19	2026-08-24 11:52:19
7	221103001	citralestari@student.stmik-bandung.ac.id	$2y$12$d6wZMt2baVxk1ibOT0n3s./QvPnuC2mFbbjtFih.woLLiB.5Rd6lm	mahasiswa	t	f	\N	\N	\N	2026-08-24 11:52:19	2026-08-24 11:52:19
8	221103002	denifirmansyah@student.stmik-bandung.ac.id	$2y$12$XJKKF.oyVUvwmgw123uAdu1c1rc5.gKlxeJHmZ5U7590r7ZhGbK2y	mahasiswa	t	f	\N	\N	\N	2026-08-24 11:52:19	2026-08-24 11:52:19
10	231101002	fajarnugroho@student.stmik-bandung.ac.id	$2y$12$MfU5B4jRersKZi9bQP/H3O6rgjyFt0/3b6S5ujCL9MrpvA5/.Nzx.	mahasiswa	t	f	\N	\N	\N	2026-08-24 11:52:19	2026-08-24 11:52:19
39	202131020	gita.permana58@example.com	$2y$12$0HzeaE644.109M0g94rkWO7EssaHgzJEia4ylAYB6VPWyVng2ScOq	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:28	2026-08-27 17:59:28
12	02738	jawa@gmail.com	$2y$12$mA6ojUyhCzbfu5VWvO6lz.LL6FHSQZczYkOp7lDp4mW2EAJ0aMP/C	dosen	t	t	\N	\N	\N	2026-08-26 13:03:55	2026-08-26 13:03:55
40	202337021	eka.wijaya17@example.com	$2y$12$480sOA3hdqOF/jGQyVgp6.gjRiXuKvqYz8UzC3RXW844oKaDigXdS	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:29	2026-08-27 17:59:29
5	211102001	andipratama@student.stmik-bandung.ac.id	$2y$12$6Wlre5TcokPnx7yDVb8lwe9KwC9sN.Oe.kPgM31nuZmdh5xpLQ.QC	mahasiswa	t	f	\N	2026-08-27 13:38:38	\N	2026-08-24 11:52:18	2026-08-27 13:38:38
2	0426018001	drbudisantoso,mkom@stmik-bandung.ac.id	$2y$12$K0fagFEmcS9JOv5J.xTLR.xuyHr.qjV1RX2ftFriWrGQH1FpoY2Ya	dosen	t	f	\N	2026-08-27 16:13:21	\N	2026-08-24 11:52:17	2026-08-27 16:13:21
13	23467	jamalud@gmail.com	$2y$12$IfqEgxvpzSxifFlGTmSF9.tL2HlU/lAod28UAyuYWuFVt6Agwp8US	dosen	t	t	\N	\N	\N	2026-08-26 21:16:21	2026-08-26 21:16:21
20	202238001	andi.saputra27@example.com	$2y$12$oV1SWSHJgATyzAW2wUmFIORKzW5PmnFgLkxyLCdvviEZt01lpPaDy	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:22	2026-08-27 17:59:22
14	7456893	man@gmail.com	$2y$12$RBujs2KcyBWatfjki50LJuTg9kJYMeny1T6HgRIXVjn/ZnfweJit2	mahasiswa	t	t	\N	\N	\N	2026-08-27 10:21:49	2026-08-27 10:21:49
15	9376492	duatiga@gmail.com	$2y$12$B20RjMpWK1QJstiyk69/geHwpJyP0nG4VdpT1.BV.ggMI50jNZpKq	mahasiswa	t	t	\N	\N	\N	2026-08-27 10:23:48	2026-08-27 10:23:48
16	7254827392	kela@gmail.com	$2y$12$IrBGZwfBFxuhkNlVQ0HxS.TxIIzT9DTtJzySmZlj6DtJngNrUpt5q	dosen	t	t	\N	\N	\N	2026-08-27 10:25:06	2026-08-27 10:25:06
22	202329003	naufal.wibowo37@example.com	$2y$12$eIUfqI8bUQmH4n9IWlKnqeRWbrhVtSwUHvuiOOrzw./3jQA4YXwJ2	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:22	2026-08-27 17:59:22
17	mahasiswa	jam@gmail.com	$2y$12$HclfONiIpfP/pgO5ddPWfewBBMQHxj8CuvGk8PWwR2gGFv2RRslMi	mahasiswa	t	t	\N	\N	\N	2026-08-27 10:43:23	2026-08-27 10:43:23
18	825492	jaman@gmail.com	$2y$12$hZ4paD1gVY1rVXSKumgVLO/qDEcE1e0c0Xw8RAAeykULVncf9uG..	mahasiswa	t	t	\N	\N	\N	2026-08-27 10:50:48	2026-08-27 10:50:48
19	8463943	jale@gmail.com	$2y$12$CqaCHVtmRjKFySw48oSNBezBVBWdfYzGxa3eSEo3hl.r0HXCdxfWq	mahasiswa	t	t	\N	\N	\N	2026-08-27 11:03:16	2026-08-27 11:03:16
23	202158004	bunga.siregar20@example.com	$2y$12$gs9/U0O8NI1HUg7y32UqSOPCB3NYhgwRsEDnsNb4F.kH7Fr4Fripa	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:23	2026-08-27 17:59:23
24	202320005	zul.nugroho39@example.com	$2y$12$qBhbe7mQaKc4MecxtkimKuuZ63po./m3MDLf5wOwkDhSEebrCAys.	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:23	2026-08-27 17:59:23
25	202187006	zul.saputra91@example.com	$2y$12$etEsxFOCUPaMYrZTuoMtxehopVVXtsR/SNxYZNWPeYBDvb3a.J.aa	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:23	2026-08-27 17:59:23
26	202139007	zul.wibowo14@example.com	$2y$12$Gsd4LBRGZADJlcuTl0K5X.lGui3yw04j1m8KLccY/VY0bFkYareq.	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:24	2026-08-27 17:59:24
41	202133022	budi.firmansyah18@example.com	$2y$12$aOTKSjdXZnBkq1saEQWpiuTgW6FRapWRDHrnpESrYoWW3.a1mrvXW	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:29	2026-08-27 17:59:29
27	202492008	yoga.suryadi68@example.com	$2y$12$c0dVFasq2mSQPYQ1d/n5FeaRasFBinhMksGWwOkDeCAvibvkvS5aS	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:24	2026-08-27 17:59:24
28	202338009	tari.permana27@example.com	$2y$12$RRMVPic97C5XqyID9Sy6QeWEGlQ6WXZXiJtJN3GYZeCa.YZt6Fu6S	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:24	2026-08-27 17:59:24
29	202458010	utami.hidayat86@example.com	$2y$12$QlX8smkh08DqTiBelPp.v.9DB4gZdF1rb4arWCmJF3HfH1u5I2cza	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:25	2026-08-27 17:59:25
9	231101001	ekawulandari@student.stmik-bandung.ac.id	$2y$12$pCbtCVDDPiWEqPtbqgA9eujonoiE.BXIksnyoX4EAw.9HHaBqEiyW	mahasiswa	t	f	\N	2026-08-27 12:32:14	\N	2026-08-24 11:52:19	2026-08-27 12:32:14
30	202147011	vina.wibowo65@example.com	$2y$12$pxGEhK0H2KQOJMk2Fi2JJufmD.v3pbauRaVGbAUF3xu1PJd5no2jS	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:25	2026-08-27 17:59:25
31	202229012	vina.firmansyah57@example.com	$2y$12$6o8z4Cqwd0e0woLujkkZR.eHTbfnne2XhZaiZ.IkuK.AGfH.TMBEm	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:26	2026-08-27 17:59:26
32	202140013	jasmine.nugroho82@example.com	$2y$12$G0vZFxrMzrbfhl77ftTXkOHlU6xlHlqEvNdKMI4.NvCGoBYrFpGny	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:26	2026-08-27 17:59:26
42	202494023	wahyu.hidayat84@example.com	$2y$12$bGX1AaB1AliG.1c8tqFtpeskYI9seosQ23trzfj6Gw1rZBaVGpAvi	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:29	2026-08-27 17:59:29
43	202450024	eka.utami19@example.com	$2y$12$e0PcDsNmrPEYhPzpg5.B2eBcv4EheOgVQUIyT7p6MwCREDy94Utf2	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:30	2026-08-27 17:59:30
33	202437014	irfan.firmansyah79@example.com	$2y$12$PJAVAdulaz5AoxKDdljlYOvP2wYmVjDRiTAVxsmHuJV.bYVPeaHza	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:26	2026-08-27 17:59:26
34	202153015	hendra.nugroho12@example.com	$2y$12$NHpnh8e/BoVqe/gZEcHFeOVS/E2lWf1LnEIRwPuAiVMckCkKjCvZG	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:27	2026-08-27 17:59:27
35	202319016	candra.pratama75@example.com	$2y$12$HPkFBWuZ6D7QznY3JjuYoOY.RQ9gBIy5z5er3r7gKrR08kHTtpduy	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:27	2026-08-27 17:59:27
36	202434017	hana.suryadi22@example.com	$2y$12$77542j.XuOG03ANRdDF2weX35TbWHPSc.x2jSvhyKERVhbxfoWjmu	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:27	2026-08-27 17:59:27
37	202323018	budi.permana41@example.com	$2y$12$drRnVu0Zp4fcyV3QgGCfPOhHJrbZQKMIPEkjSfVH8oW1WgBEJiwqS	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:28	2026-08-27 17:59:28
38	202480019	hana.hidayat22@example.com	$2y$12$SgZbnlQUN07YhXutG6fPT.3dzArdwlOZ5XemD73XYp4yoAie5pfEu	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:28	2026-08-27 17:59:28
44	202141025	eka.setiawan57@example.com	$2y$12$Gqlqxp59Rhzx0QsH01ml7.3Hc4.xG4r2UUVbrMubenABSOGm3pXVm	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:30	2026-08-27 17:59:30
45	202394026	zul.gunawan23@example.com	$2y$12$EPz8U.28kFYOykPmvlMKoeaowOhHeSm75Fc5Dvmf9QnYdoy6tLO9a	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:30	2026-08-27 17:59:30
46	202374027	kevin.wijaya72@example.com	$2y$12$epCFEmGNpXl/JbVMOjo9IegDuXpDUVtL5yP/AU5PxuP1JRKhm83qS	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:31	2026-08-27 17:59:31
47	202266028	yoga.saputra80@example.com	$2y$12$4HgmzmNIftkZoQ6BralGye5RuncD0wa8tqwwFUuajADXF1KVGdoxG	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:31	2026-08-27 17:59:31
21	202181002	hendra.firmansyah35@example.com	$2y$12$ITokBKT/MH1Ev4kFVSnpB.G3L9N5aSjM5ql1cDaKOuEYyDd0ywUAm	mahasiswa	t	t	\N	2026-08-27 21:56:33	\N	2026-08-27 17:59:22	2026-08-27 21:56:33
48	202149029	naufal.kusuma56@example.com	$2y$12$KUVF9bcA4Ze/FHPSh0cUm.tlAOW5mWYu1gBY31RO2JWoA6FyliFIS	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:31	2026-08-27 17:59:31
49	202262030	hendra.lestari13@example.com	$2y$12$xCk5by3CpLCTcM9qeJ1uPOKqaoYtXto2hVI8I8zrmycVpUpzbQNTG	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:32	2026-08-27 17:59:32
50	202235031	bunga.suryadi68@example.com	$2y$12$VS2gxUtfKEU.sygVFo.0fON5nARxnF0Rlk8iYJ58AcVk.a.prG9I.	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:32	2026-08-27 17:59:32
51	202392032	citra.saputra75@example.com	$2y$12$yW7rAQzz8YmFOGGQ6r1Zpe2pbeChXeeQHCyZ7ru4eANwlCVrYn1Gm	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:32	2026-08-27 17:59:32
52	202454033	bunga.rahmawati50@example.com	$2y$12$QQdcTbsEam8wHDbHySbGmuqeoNLPFMtBioZlwKMWHkU.r8scmBFTG	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:33	2026-08-27 17:59:33
53	202256034	anisa.firmansyah65@example.com	$2y$12$JPgwJOM9nP6CPZuLZCVZRezzAf8RclMhIV5CLbhcpZlA87IrfFcfK	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:33	2026-08-27 17:59:33
54	202380035	kartika.permana26@example.com	$2y$12$yFgG7A4L1EvO5r5WxLDB7eDYCGJb./LpCWTySHGwKYfOGeE0Rwb8u	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:33	2026-08-27 17:59:33
55	202346036	siti.santoso36@example.com	$2y$12$bGbfHdIXqkZbVgXIYfbo4ODdvM0p28KDiVVmUoG7S0SKOIb4CzHUy	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:34	2026-08-27 17:59:34
56	202375037	zul.hidayat94@example.com	$2y$12$GAhFZOWoXSX883k1pDI4feqRSFT9HQkU7FfHXFR9XF36.StYpe2pS	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:34	2026-08-27 17:59:34
57	202488038	budi.nugroho19@example.com	$2y$12$fHnXOd/4gDl5fRK33YWXEuSmR.KLURlQwQGCvaP.45hjqJOIsSDwO	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:34	2026-08-27 17:59:34
58	202164039	eko.santoso38@example.com	$2y$12$6mQCrsz6dF83CQQTwmgiU.4j45tnOBv5DKUfvnr92viN2U76jMZHW	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:35	2026-08-27 17:59:35
59	202366040	oki.firmansyah88@example.com	$2y$12$r1lchpIvqENFS/z0/vkt8utf40iwlJyeCvQdu4.Lh7gc9Cq6WtVSW	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:35	2026-08-27 17:59:35
60	202490041	yoga.saputra40@example.com	$2y$12$mkozYDCbwqSbpDlUl15fGeq3C0TrHsFivHY8kZ2mKmhqZfhzwawv2	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:35	2026-08-27 17:59:35
61	202259042	eko.kusuma98@example.com	$2y$12$hl1K4aS/F0.meyjckRBV7.p9/iJcEWcaRjn6XMszQOTCmj93gdg0m	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:36	2026-08-27 17:59:36
62	202459043	bunga.wijaya84@example.com	$2y$12$47jib1YjVE45KWqzsPuL1.b4Rxg2mOfc2vhuIARgMTwi7T2BtPnDm	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:36	2026-08-27 17:59:36
63	202365044	pratama.nugroho72@example.com	$2y$12$VQM/DxznB40aRusL4b73RuUKXD4amNlfC7ddWik5GW9hpA7ugtCsu	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:36	2026-08-27 17:59:36
64	202120045	muhammad.handoko92@example.com	$2y$12$85nrJDPnO2dtbE2/FI8/yuouvMJCB/ACFsFETM.twCEdc5huV/QA.	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:37	2026-08-27 17:59:37
65	202358046	oki.wibowo45@example.com	$2y$12$g9ozrSNXyD1fNnFraAfK3.T4ru701PxvDs/LVIXMEPE.llkcjvWD.	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:37	2026-08-27 17:59:37
66	202113047	yoga.hidayat41@example.com	$2y$12$VQAZofekLlibDJXRf8v4lOVaIwfjGj3j7jbYTdvI210ey/oPLFtwG	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:37	2026-08-27 17:59:37
67	202331048	oki.saputra87@example.com	$2y$12$4xWwwEORI7Uv7ynk7Kv2qOOVRR83I4FMOxmQef4DZR7/aEYQ712Pi	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:38	2026-08-27 17:59:38
68	202185049	maya.wijaya98@example.com	$2y$12$zlOyhjUDFeUCXXQby131HOcibGzD9h5PfbMew7dfC2Ygb.1BLnRMG	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:38	2026-08-27 17:59:38
69	202174050	winda.setiawan92@example.com	$2y$12$n0k3yVXAFCwJUdz7jNAOc.73BndnQ.Ozyh5a/RR9C8E85XYCFidXG	mahasiswa	t	t	\N	\N	\N	2026-08-27 17:59:39	2026-08-27 17:59:39
134	1224067	ahmad@gmail.com	$2y$12$Lwf3sYEflsgJQy8FR1d5POKabRIVud0UAGKpTCXkxv/sYIvntdSzC	mahasiswa	t	t	\N	\N	\N	2026-08-31 10:41:20	2026-08-31 10:41:20
135	1228934	siti@gmail.com	$2y$12$z8dHFLD0QxnXCCW4XD3HyuWuemgQrxv1lUhjHNfwdTFFL1HUyOLSa	mahasiswa	t	t	\N	\N	\N	2026-08-31 10:41:21	2026-08-31 10:41:21
84	202502001	irfan.hidayat1@gmail.com	$2y$12$nR0yC2Av8H.t1IG2uzugh.3QjaJMzwNaLYHMnhsRcJV7kW/7xtiCq	mahasiswa	t	t	\N	\N	\N	2026-08-27 19:46:13	2026-08-27 20:36:53
86	202301003	zul.kusuma3@gmail.com	$2y$12$vBY9/7H36K4SCNOsPgrRwea1ljX/SRX/h0sTr25Ggyql1i4HyMiDS	mahasiswa	t	t	\N	\N	\N	2026-08-27 19:46:14	2026-08-27 20:36:53
87	202401004	wahyu.hapsari4@outlook.com	$2y$12$NKK7ms.AlII/oB/8qveuX.7VzIzbE0nquhw7m2bNnTdbbYQpmB/k2	mahasiswa	t	t	\N	\N	\N	2026-08-27 19:46:14	2026-08-27 20:36:53
89	202201006	tari.wibowo6@gmail.com	$2y$12$bUedcy5BqDxBZGesOTnUVODz9Q8lwnnMbw8dvUrqHFokqHRX0ZMmS	mahasiswa	t	t	\N	\N	\N	2026-08-27 19:46:15	2026-08-27 20:36:53
91	202402008	andi.saputra8@outlook.com	$2y$12$UGAN1DwQzIvbghysdLIJIev20.gxjstcLC0ln6CBzhxq.bSm.H6ii	mahasiswa	t	t	\N	\N	\N	2026-08-27 19:46:15	2026-08-27 20:36:53
85	202301002	yulia.nugroho2@yahoo.co.id	$2y$12$RTfS9kE279Z4xPExzabuDewH2naBo0I.qN8f8vORRi56tckQ0hSNi	mahasiswa	t	t	\N	2026-08-27 22:52:47	\N	2026-08-27 19:46:13	2026-08-27 22:52:47
88	202201005	lestari.firmansyah5@yahoo.co.id	$2y$12$1kbdjdUeyB3RqeI3f4UbAu6v00qQdgEeVe96Kvd1sDSSJvk8J6kOa	mahasiswa	t	t	\N	2026-08-28 07:02:48	\N	2026-08-27 19:46:14	2026-08-28 07:02:48
90	202302007	putri.hapsari7@gmail.com	$2y$12$TIhOla6VQFAeCAh0t5iWXuN8UzJslOVpozts7GJQrkzW/EBH2nMiW	mahasiswa	t	t	\N	2026-08-28 07:05:29	\N	2026-08-27 19:46:15	2026-08-28 07:05:29
92	202202009	setyo.permana9@hotmail.com	$2y$12$97r2gNPC4RZ29hyhObE29un1S4VlrFzdlAkz9BR76MBGgTkO4vAk2	mahasiswa	t	t	\N	2026-08-28 07:06:59	\N	2026-08-27 19:46:16	2026-08-28 07:06:59
93	202302010	naufal.hidayat10@hotmail.com	$2y$12$C4pF1zjA1fVl8jMXQuxGc.n1WlYifaW37PkaTgfFGlDcNSBnZ6CrK	mahasiswa	t	t	\N	2026-08-28 07:29:36	\N	2026-08-27 19:46:16	2026-08-28 07:29:36
71	0415088202	rina.novita@gmail.com	$2y$12$AzZK2W26CruvSqNVB0zHJOyuAwlpQru44qGcRzqNXtWQq.jZCU.OS	dosen	t	t	\N	2026-08-28 07:38:41	\N	2026-08-27 18:31:30	2026-08-28 07:38:41
73	0410037904	dewi.kusuma@yahoo.com	$2y$12$tu9FIcKHqMtrMVN9OGjCkOPXPTivoCProb0xLl09ibkxzmQbEKtqa	dosen	t	t	\N	2026-08-31 09:24:55	\N	2026-08-27 18:31:31	2026-08-31 09:24:55
72	0420118503	budi.raharjo@yahoo.co.id	$2y$12$J.jFP0O06NX/TXGLEkUsxO/YTRXsyL7nEpVlJEuDieWg7r87Wbe7C	dosen	t	t	\N	2026-08-31 09:25:55	\N	2026-08-27 18:31:31	2026-08-31 10:42:59
1	admin	admin@stmik-bandung.ac.id	$2y$12$zwE41vkVhLVDrvKg2JV2KuhnNHVm8GW/32Nw/JTKaiVyBKm9N9lye	admin	t	f	\N	2026-08-31 11:03:43	\N	2026-08-24 11:52:17	2026-08-31 11:03:43
70	0401057801	ahmad.fauzi@gmail.com	$2y$12$DhKKx6QcpH1z91o1ZsViM.rdr2xgQhcgPSOaiT7bs9Dg2p1xlgvXa	dosen	t	t	\N	2026-08-31 11:04:55	\N	2026-08-27 18:31:30	2026-08-31 11:04:55
75	0412128706	fitriani.lestari@yahoo.com	$2y$12$SrXZtHv/n3IXURJfrTDiSeJ/9h9zEQWNEXrX5HBQ5DkOj/pvIZXwi	dosen	t	t	\N	\N	\N	2026-08-27 18:31:32	2026-08-27 20:36:35
76	0425018307	hendra.wijaya@gmail.com	$2y$12$FVpka5Jmh6pK3FBWQfacXe/3vb7aU3k3mk8mih85RaxYsR0Z8XYNu	dosen	t	t	\N	\N	\N	2026-08-27 18:31:32	2026-08-27 20:36:35
77	0414068908	indah.permata@hotmail.com	$2y$12$e8J7Ojkta/JnZUqUELFDheB8.mx3sckCCQqN2sOnclp/VrizXKjci	dosen	t	t	\N	\N	\N	2026-08-27 18:31:32	2026-08-27 20:36:35
94	202302011	maya.setiawan11@yahoo.co.id	$2y$12$GgmKegmQOaVdd7wcmGQULOcezPtV7mGTwBzYRdI4N0/OjTwZrC96G	mahasiswa	t	t	\N	\N	\N	2026-08-27 19:46:16	2026-08-27 20:36:53
96	202302013	setyo.setiawan13@gmail.com	$2y$12$6QHSe37ITENqRF7.SY.7A.PYMexsSzg5Tb3jT/S28JAFKA.RHf41G	mahasiswa	t	t	\N	\N	\N	2026-08-27 19:46:17	2026-08-27 20:36:53
97	202201014	rizky.wijaya14@yahoo.com	$2y$12$xqDF2qTfifIaGKQa9NKrJeKBmZeZHw9X.XQdNmKXAzMoPytwXLqKS	mahasiswa	t	t	\N	\N	\N	2026-08-27 19:46:17	2026-08-27 20:36:53
100	202502017	muhammad.pratama17@hotmail.com	$2y$12$7SHVxPH1GQMh/HDHXR/yp.ECwC43AvhVTx5zhYAwVt1HnCyKNi71W	mahasiswa	t	t	\N	\N	\N	2026-08-27 19:46:18	2026-08-27 20:36:53
101	202202018	bunga.permana18@yahoo.co.id	$2y$12$SbUf8ZPOHqpbpyyfPWvY0.3lsm5fqpE59fNPQF6ZQ7HhbACKw.wxW	mahasiswa	t	t	\N	\N	\N	2026-08-27 19:46:19	2026-08-27 20:36:53
102	202402019	hana.siregar19@yahoo.com	$2y$12$AQuYGrHje7vB55Jjb6BD2OFVZSUdxyDOge16QIOlGcRf./PB3Eu.W	mahasiswa	t	t	\N	\N	\N	2026-08-27 19:46:19	2026-08-27 20:36:53
103	202302020	pratama.gunawan20@yahoo.com	$2y$12$YBNG.dSd2iiRCx1Tyfz9j.dX0XUxOtlPzIThcbwLjWm7k6qX3l3v.	mahasiswa	t	t	\N	\N	\N	2026-08-27 19:46:19	2026-08-27 20:36:53
105	202301022	budi.saputra22@outlook.com	$2y$12$V11Q4wvkv5rK0VjF6vQBIeIbjLHv/B.nWhQPn9la4bIxVFJcag6tG	mahasiswa	t	t	\N	\N	\N	2026-08-27 19:46:20	2026-08-27 20:36:53
106	202202023	gita.firmansyah23@gmail.com	$2y$12$W2iifmEo1sbYbgWdgpsUQOeZDHSGR86HM2xObIWPUzXuIGWtgTog.	mahasiswa	t	t	\N	\N	\N	2026-08-27 19:46:20	2026-08-27 20:36:53
107	202301024	pratama.kusuma24@hotmail.com	$2y$12$U96KAzFvtAOTkAb1wxxlC.qoWf7TSJUhqK1jtR5/KP4eaUE3MhMf2	mahasiswa	t	t	\N	\N	\N	2026-08-27 19:46:21	2026-08-27 20:36:53
108	202502025	budi.nugroho25@outlook.com	$2y$12$qWcja5GtB3db092qt/yWReRAQxPdOHGR79k0bq/jOafgbFOJlii7a	mahasiswa	t	t	\N	\N	\N	2026-08-27 19:46:21	2026-08-27 20:36:53
109	202302026	hana.ramadhan26@gmail.com	$2y$12$wFJTFbU7bAF05nnlD8/2b.iZ6c5IiS.CmMWfHAW2N3k5LfM2hPNYG	mahasiswa	t	t	\N	\N	\N	2026-08-27 19:46:21	2026-08-27 20:36:53
110	202401027	deni.siregar27@gmail.com	$2y$12$qRe/BSgK8A8YpsmGWDLbZ.q074R9lOuBz5TF1Gsa8qg5JDt3n1GHy	mahasiswa	t	t	\N	\N	\N	2026-08-27 19:46:22	2026-08-27 20:36:53
111	202302028	zahra.hidayat28@yahoo.co.id	$2y$12$/7sbcbNrni9qQb2x1jmHjODO9uE34cITJjExSGyDt.EMqvJj1Svzu	mahasiswa	t	t	\N	\N	\N	2026-08-27 19:46:22	2026-08-27 20:36:53
113	202301030	olivia.wijaya30@gmail.com	$2y$12$Fj6b9AcBHl.VpxV6NmD.AOudp8LSolaPTELFEO1Qd3ELwPpZS90Yu	mahasiswa	t	t	\N	\N	\N	2026-08-27 19:46:23	2026-08-27 20:36:53
114	202201031	hana.pratama31@gmail.com	$2y$12$fL95R4X15HM5PddrkbnIMuupleOuYOTfrLHmE9sPKiC9fudowfM5C	mahasiswa	t	t	\N	\N	\N	2026-08-27 19:46:23	2026-08-27 20:36:53
115	202402032	nabila.gunawan32@gmail.com	$2y$12$fm6TYvQEwI5v5pCtbbs31uftR7x2cmL918aI8xDk2n6mjMQdmayMW	mahasiswa	t	t	\N	\N	\N	2026-08-27 19:46:23	2026-08-27 20:36:53
116	202202033	yoga.utami33@yahoo.com	$2y$12$RDARD74RT9Xz5hioho/QouWlYMyO6xC38bVT6BtGmU6J/WPVTIM86	mahasiswa	t	t	\N	\N	\N	2026-08-27 19:46:24	2026-08-27 20:36:54
117	202502034	bayu.setiawan34@yahoo.com	$2y$12$9tMQymNEGm3a9tSp403QludeTQ5WArWSJ9ExLwQ59p5fgEQATLK7a	mahasiswa	t	t	\N	\N	\N	2026-08-27 19:46:24	2026-08-27 20:36:54
120	202201037	andi.hidayat37@outlook.com	$2y$12$ePIeuuMA44KI6Zwl9RUdluhwsA3GXjQa2mtN7NB7jjLPHR8Ide.lO	mahasiswa	t	t	\N	\N	\N	2026-08-27 19:46:25	2026-08-27 20:36:54
121	202201038	naufal.kusuma38@hotmail.com	$2y$12$AFUqZWkbT.hrDy3z6fpP6e4wwBwslo4hH./LvKWoAfnIZxq4j2bjW	mahasiswa	t	t	\N	\N	\N	2026-08-27 19:46:25	2026-08-27 20:36:54
122	202201039	indah.handoko39@outlook.com	$2y$12$6EUnlTnFM9SluP/zBGFbaeA/fzCBYC6nEj6lqycNOduZSk537H5XG	mahasiswa	t	t	\N	\N	\N	2026-08-27 19:46:26	2026-08-27 20:36:54
123	202202040	gita.suryadi40@yahoo.co.id	$2y$12$puqgYE2gEzZOQC8016VYSOHWPNqSm5lw3kIiu8IxjZ/YuVc4FF.T.	mahasiswa	t	t	\N	\N	\N	2026-08-27 19:46:26	2026-08-27 20:36:54
124	202401041	tari.ramadhan41@outlook.com	$2y$12$hjxWYKpf8W9mzPeoOQdZ1O24Anke0ckeQZYKZy1GfFHi7haqW2ap.	mahasiswa	t	t	\N	\N	\N	2026-08-27 19:46:27	2026-08-27 20:36:54
125	202201042	yoga.firmansyah42@gmail.com	$2y$12$CRO4joNbCkEHA/AkUutwduH4LwAmWK4MBW8TCHqPxzHOluBD5Vhgm	mahasiswa	t	t	\N	\N	\N	2026-08-27 19:46:27	2026-08-27 20:36:54
126	202301043	candra.pratama43@yahoo.co.id	$2y$12$KE.fXfBAI6vAHSIBe.VcsuSwIYdhbLLDZpiEUNqN5LeqE2QQajfOm	mahasiswa	t	t	\N	\N	\N	2026-08-27 19:46:27	2026-08-27 20:36:54
127	202201044	fitri.gunawan44@yahoo.co.id	$2y$12$ZJwELFIOlp2m0bXRMZwSsurM3LPE03jmFelLKo/trvQlZ/jaZ6C2e	mahasiswa	t	t	\N	\N	\N	2026-08-27 19:46:27	2026-08-27 20:36:54
128	202402045	anisa.setiawan45@hotmail.com	$2y$12$Cr8o9UYS/i.08wXp9yZLeu7NpaZmF.iZar5BRlQglf/0HmiQQJJUi	mahasiswa	t	t	\N	\N	\N	2026-08-27 19:46:28	2026-08-27 20:36:54
129	202501046	pratama.setiawan46@outlook.com	$2y$12$od4WS6cIUE9IshADIrGh.exBaXGC2H7s5nKyVWG5o3V0rZAPTyYfm	mahasiswa	t	t	\N	\N	\N	2026-08-27 19:46:28	2026-08-27 20:36:54
130	202502047	yoga.firmansyah47@yahoo.com	$2y$12$4eznSSyjrtgKCNQh1EXZ7ONKTp5A7clJG7OdZKRLzqNhzAibQSvI6	mahasiswa	t	t	\N	\N	\N	2026-08-27 19:46:28	2026-08-27 20:36:54
131	202301048	lukman.pratama48@hotmail.com	$2y$12$9Qh2OnLxRNRYdQswifg32eQNBkDfQzEebmm8ZQ9nm9.pimLEkTmTC	mahasiswa	t	t	\N	\N	\N	2026-08-27 19:46:29	2026-08-27 20:36:54
132	202202049	dimas.suryadi49@hotmail.com	$2y$12$JmRRFK/tBShQkuUsBbFS4e3k6cP7f7Y8hEnEw4zI1emjFSPDFujkm	mahasiswa	t	t	\N	\N	\N	2026-08-27 19:46:29	2026-08-27 20:36:54
133	202502050	kartika.pratama50@hotmail.com	$2y$12$1gTh.ah4ADF30JMAgtGsl.0PW5ACwOIUqUvynW5Gc/VAE.EHnPmWe	mahasiswa	t	t	\N	\N	\N	2026-08-27 19:46:29	2026-08-27 20:36:54
79	0404048810	kartika.sari@hotmail.com	$2y$12$e7SdwYFTnAsmJbZzIfcUyuUHhRJNDQS.lz8zbnutG3nF2z11shZXa	dosen	t	t	\N	2026-08-30 14:53:18	\N	2026-08-27 18:31:33	2026-08-30 14:53:18
112	202501029	hendra.siregar29@outlook.com	$2y$12$UYj8YBL9EsereB386FAxc.gc1PEqDN4EbJaHLoDaCY25bxO4bZxIm	mahasiswa	t	t	\N	2026-08-27 21:50:46	\N	2026-08-27 19:46:22	2026-08-27 21:50:46
78	0408107609	joko.susilo@gmail.com	$2y$12$rckLMNakI3edgjLDomX22OmgRSd1hhSQKwAepzRZ316yaONDCJFO.	dosen	t	t	\N	2026-08-31 10:55:10	\N	2026-08-27 18:31:33	2026-08-31 10:55:10
119	202401036	citra.kurniawan36@yahoo.co.id	$2y$12$vJlGJdh06Ms0eVnNj5Z8huaRPjkNisFknN3E4b/J9V4wAl4lRcmEK	mahasiswa	t	t	\N	2026-08-31 09:07:05	\N	2026-08-27 19:46:25	2026-08-31 09:07:05
104	202301021	zahra.permana21@gmail.com	$2y$12$vj/6Vf.Gm5EYxlZ9T2vYa.fMcSAVTo8ngryFDDQI3lKidPmf.u8xW	mahasiswa	t	t	\N	2026-08-28 07:28:20	\N	2026-08-27 19:46:20	2026-08-28 07:28:20
74	0405078105	eko.prasetyo@yahoo.com	$2y$12$vJidLStkslQ1rDfXU1ynDudGXfdJ5fRvjY6GZ9Ym4/ikvhclqWczm	dosen	t	t	\N	2026-08-28 07:46:11	\N	2026-08-27 18:31:31	2026-08-28 07:46:11
118	202201035	lukman.lestari35@gmail.com	$2y$12$SlCq3PEWp/dku82gO2TUnehdz1979WtiBxozWCMoRkgmZRwJiQuue	mahasiswa	t	t	\N	2026-08-28 07:48:18	\N	2026-08-27 19:46:24	2026-08-28 07:48:18
95	202502012	olivia.subagyo12@yahoo.co.id	$2y$12$j0E9BBMfxeFca.MPGjHWzuKlh8G1c6MlEcVVhvQnwpbhUlNz9AbJG	mahasiswa	t	t	\N	2026-08-31 10:52:07	\N	2026-08-27 19:46:17	2026-08-31 10:52:07
98	202501015	pratama.suryadi15@yahoo.com	$2y$12$nlai7OGKh0cIAScK8J5Pw.GoW/dYv6QY6wFhiteVDBJYevM5KYcgW	mahasiswa	t	t	\N	2026-08-31 10:47:38	\N	2026-08-27 19:46:18	2026-08-31 10:47:38
\.


--
-- Name: dosen_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.dosen_id_seq', 56, true);


--
-- Name: failed_jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.failed_jobs_id_seq', 1, false);


--
-- Name: jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.jobs_id_seq', 1, false);


--
-- Name: mahasiswa_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.mahasiswa_id_seq', 263, true);


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.migrations_id_seq', 11, true);


--
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.personal_access_tokens_id_seq', 102, true);


--
-- Name: perwalian_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.perwalian_id_seq', 30, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 135, true);


--
-- Name: cache_locks cache_locks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cache_locks
    ADD CONSTRAINT cache_locks_pkey PRIMARY KEY (key);


--
-- Name: cache cache_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cache
    ADD CONSTRAINT cache_pkey PRIMARY KEY (key);


--
-- Name: dosen dosen_nidn_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dosen
    ADD CONSTRAINT dosen_nidn_unique UNIQUE (nidn);


--
-- Name: dosen dosen_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dosen
    ADD CONSTRAINT dosen_pkey PRIMARY KEY (id);


--
-- Name: failed_jobs failed_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_pkey PRIMARY KEY (id);


--
-- Name: failed_jobs failed_jobs_uuid_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_uuid_unique UNIQUE (uuid);


--
-- Name: job_batches job_batches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_batches
    ADD CONSTRAINT job_batches_pkey PRIMARY KEY (id);


--
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- Name: mahasiswa mahasiswa_nim_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mahasiswa
    ADD CONSTRAINT mahasiswa_nim_unique UNIQUE (nim);


--
-- Name: mahasiswa mahasiswa_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mahasiswa
    ADD CONSTRAINT mahasiswa_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (email);


--
-- Name: personal_access_tokens personal_access_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personal_access_tokens
    ADD CONSTRAINT personal_access_tokens_pkey PRIMARY KEY (id);


--
-- Name: personal_access_tokens personal_access_tokens_token_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personal_access_tokens
    ADD CONSTRAINT personal_access_tokens_token_unique UNIQUE (token);


--
-- Name: perwalian perwalian_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.perwalian
    ADD CONSTRAINT perwalian_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_unique UNIQUE (username);


--
-- Name: cache_expiration_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cache_expiration_index ON public.cache USING btree (expiration);


--
-- Name: cache_locks_expiration_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cache_locks_expiration_index ON public.cache_locks USING btree (expiration);


--
-- Name: jobs_queue_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX jobs_queue_index ON public.jobs USING btree (queue);


--
-- Name: mahasiswa_dosen_wali_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mahasiswa_dosen_wali_id_index ON public.mahasiswa USING btree (dosen_wali_id);


--
-- Name: mahasiswa_program_studi_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mahasiswa_program_studi_index ON public.mahasiswa USING btree (program_studi);


--
-- Name: personal_access_tokens_expires_at_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX personal_access_tokens_expires_at_index ON public.personal_access_tokens USING btree (expires_at);


--
-- Name: personal_access_tokens_tokenable_type_tokenable_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX personal_access_tokens_tokenable_type_tokenable_id_index ON public.personal_access_tokens USING btree (tokenable_type, tokenable_id);


--
-- Name: perwalian_status_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX perwalian_status_index ON public.perwalian USING btree (status);


--
-- Name: perwalian_tahun_akademik_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX perwalian_tahun_akademik_index ON public.perwalian USING btree (tahun_akademik);


--
-- Name: sessions_last_activity_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sessions_last_activity_index ON public.sessions USING btree (last_activity);


--
-- Name: sessions_user_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sessions_user_id_index ON public.sessions USING btree (user_id);


--
-- Name: dosen dosen_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dosen
    ADD CONSTRAINT dosen_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: mahasiswa mahasiswa_dosen_wali_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mahasiswa
    ADD CONSTRAINT mahasiswa_dosen_wali_id_foreign FOREIGN KEY (dosen_wali_id) REFERENCES public.dosen(id) ON DELETE SET NULL;


--
-- Name: mahasiswa mahasiswa_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mahasiswa
    ADD CONSTRAINT mahasiswa_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: perwalian perwalian_mahasiswa_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.perwalian
    ADD CONSTRAINT perwalian_mahasiswa_id_foreign FOREIGN KEY (mahasiswa_id) REFERENCES public.mahasiswa(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict RmXfZdSmcfKGp4wbB6t0AOkfsau2aQnMfDFJI9qc3DV7R8B2ads5piBANF1f2eC

