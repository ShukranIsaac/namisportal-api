--
-- PostgreSQL database dump
--

-- Dumped from database version 10.12 (Ubuntu 10.12-0ubuntu0.18.04.1)
-- Dumped by pg_dump version 10.12 (Ubuntu 10.12-0ubuntu0.18.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: namisportal; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE namisportal WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.UTF-8' LC_CTYPE = 'en_US.UTF-8';


ALTER DATABASE namisportal OWNER TO postgres;

\connect namisportal

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: namis
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    _id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    about text NOT NULL,
    shortname character varying(255) NOT NULL,
    content text,
    level integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "categoryId" integer
);


ALTER TABLE public.categories OWNER TO namis;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: namis
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.categories_id_seq OWNER TO namis;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: namis
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: contacts; Type: TABLE; Schema: public; Owner: namis
--

CREATE TABLE public.contacts (
    id integer NOT NULL,
    _id character varying(255) NOT NULL,
    email character varying(255),
    telephone character varying(255),
    website character varying(255),
    address character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.contacts OWNER TO namis;

--
-- Name: contacts_id_seq; Type: SEQUENCE; Schema: public; Owner: namis
--

CREATE SEQUENCE public.contacts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.contacts_id_seq OWNER TO namis;

--
-- Name: contacts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: namis
--

ALTER SEQUENCE public.contacts_id_seq OWNED BY public.contacts.id;


--
-- Name: documents; Type: TABLE; Schema: public; Owner: namis
--

CREATE TABLE public.documents (
    id integer NOT NULL,
    _id character varying(255) NOT NULL,
    name character varying(255),
    description text,
    size character varying(255) NOT NULL,
    path character varying(255) NOT NULL,
    filename character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "categoryId" integer,
    "stakeholderId" integer
);


ALTER TABLE public.documents OWNER TO namis;

--
-- Name: documents_id_seq; Type: SEQUENCE; Schema: public; Owner: namis
--

CREATE SEQUENCE public.documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.documents_id_seq OWNER TO namis;

--
-- Name: documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: namis
--

ALTER SEQUENCE public.documents_id_seq OWNED BY public.documents.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: namis
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    _id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.roles OWNER TO namis;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: namis
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.roles_id_seq OWNER TO namis;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: namis
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: stakeholdercontacts; Type: TABLE; Schema: public; Owner: namis
--

CREATE TABLE public.stakeholdercontacts (
    id integer NOT NULL,
    stakeholderid integer,
    contactid integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.stakeholdercontacts OWNER TO namis;

--
-- Name: stakeholdercontacts_id_seq; Type: SEQUENCE; Schema: public; Owner: namis
--

CREATE SEQUENCE public.stakeholdercontacts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.stakeholdercontacts_id_seq OWNER TO namis;

--
-- Name: stakeholdercontacts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: namis
--

ALTER SEQUENCE public.stakeholdercontacts_id_seq OWNED BY public.stakeholdercontacts.id;


--
-- Name: stakeholders; Type: TABLE; Schema: public; Owner: namis
--

CREATE TABLE public.stakeholders (
    id integer NOT NULL,
    _id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    about text NOT NULL,
    mission text NOT NULL,
    vision text NOT NULL,
    image text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "typeId" integer
);


ALTER TABLE public.stakeholders OWNER TO namis;

--
-- Name: stakeholders_id_seq; Type: SEQUENCE; Schema: public; Owner: namis
--

CREATE SEQUENCE public.stakeholders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.stakeholders_id_seq OWNER TO namis;

--
-- Name: stakeholders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: namis
--

ALTER SEQUENCE public.stakeholders_id_seq OWNED BY public.stakeholders.id;


--
-- Name: types; Type: TABLE; Schema: public; Owner: namis
--

CREATE TABLE public.types (
    id integer NOT NULL,
    _id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    about text NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.types OWNER TO namis;

--
-- Name: types_id_seq; Type: SEQUENCE; Schema: public; Owner: namis
--

CREATE SEQUENCE public.types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.types_id_seq OWNER TO namis;

--
-- Name: types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: namis
--

ALTER SEQUENCE public.types_id_seq OWNED BY public.types.id;


--
-- Name: userroles; Type: TABLE; Schema: public; Owner: namis
--

CREATE TABLE public.userroles (
    id integer NOT NULL,
    userid integer,
    roleid integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.userroles OWNER TO namis;

--
-- Name: userroles_id_seq; Type: SEQUENCE; Schema: public; Owner: namis
--

CREATE SEQUENCE public.userroles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.userroles_id_seq OWNER TO namis;

--
-- Name: userroles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: namis
--

ALTER SEQUENCE public.userroles_id_seq OWNED BY public.userroles.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: namis
--

CREATE TABLE public.users (
    id integer NOT NULL,
    _id character varying(255) NOT NULL,
    username character varying(255) NOT NULL,
    firstname character varying(255) NOT NULL,
    lastname character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    "resetPasswordExpires" timestamp with time zone,
    "resetPasswordToken" character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.users OWNER TO namis;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: namis
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO namis;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: namis
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: namis
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: contacts id; Type: DEFAULT; Schema: public; Owner: namis
--

ALTER TABLE ONLY public.contacts ALTER COLUMN id SET DEFAULT nextval('public.contacts_id_seq'::regclass);


--
-- Name: documents id; Type: DEFAULT; Schema: public; Owner: namis
--

ALTER TABLE ONLY public.documents ALTER COLUMN id SET DEFAULT nextval('public.documents_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: namis
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: stakeholdercontacts id; Type: DEFAULT; Schema: public; Owner: namis
--

ALTER TABLE ONLY public.stakeholdercontacts ALTER COLUMN id SET DEFAULT nextval('public.stakeholdercontacts_id_seq'::regclass);


--
-- Name: stakeholders id; Type: DEFAULT; Schema: public; Owner: namis
--

ALTER TABLE ONLY public.stakeholders ALTER COLUMN id SET DEFAULT nextval('public.stakeholders_id_seq'::regclass);


--
-- Name: types id; Type: DEFAULT; Schema: public; Owner: namis
--

ALTER TABLE ONLY public.types ALTER COLUMN id SET DEFAULT nextval('public.types_id_seq'::regclass);


--
-- Name: userroles id; Type: DEFAULT; Schema: public; Owner: namis
--

ALTER TABLE ONLY public.userroles ALTER COLUMN id SET DEFAULT nextval('public.userroles_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: namis
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: namis
--

COPY public.categories (id, _id, name, about, shortname, content, level, "createdAt", "updatedAt", "categoryId") FROM stdin;
2	n5YTutozKXo	Home	<p>Welcome to the public domain interface for the&nbsp;National Agriculture Management Information System (NAMIS) in Malawi (NAMIS Public Portal). This portal not only acts as a landing page to the NAMIS system core for authorized users, but also provides access to approved statistical data output visualizations of the NAMIS system core for the benefit of stakeholders and the general public.</p><p>This portal also serves as a one stop repository of relevant agriculture related documentation most of which would already be in the public domain and is of public interest</p>	NAMIS Public Portal	\N	1	2020-08-20 14:08:03.475+00	2020-08-20 14:08:03.475+00	\N
5	VXepS2V1GXj	News	The ministry engages in several activities to improve agricultural production in Malawi. Some of these activities may end up into policy, review, evaluation, or published documents and be disseminated accordingly. However, a good proportion of these activities, while similarly important, may not culminate into specific documents or indeed even if they do, not a lot of people would engage in reading the documents. In this regard, the News section provides a quick outlet of key ministry activities that highlight the progress in its mandate within the ministry.	News	\N	1	2020-08-20 14:45:22.613+00	2020-08-20 14:45:22.613+00	\N
7	RvwKqfCneOe	About NAMIS	This section gives more details about NAMIS	NAMIS	\N	\N	2020-08-20 15:11:05.088+00	2020-08-20 15:11:05.096+00	6
3	UoWRCN4UoDa	Directory	<p>The ministry works in collaboration with several stakeholders and partners. Without trying to be exhaustive, the Directory provides a quick glance of the stakeholders and partners. The ministry is proud and appreciative of the various roles these stakeholders and partners play in improve agriculture in Malawi.</p>	Directory	\N	1	2020-08-20 14:43:52.135+00	2021-01-19 17:26:54.879+00	\N
11	zPDd8OTvaip	NAMIS Mobile App	Role of the NAMIS Mobile App is explained in this section	Mobile App Role in NAMIS	\N	\N	2020-08-20 15:14:23.906+00	2020-09-25 12:31:00.756+00	6
21	BoinHkv1S1K	Minimum Farm Gate Prices	<p>The Malawi government as mandated under the General Crops Act cap 65:05 of laws of Malawi set minimum farm gate prices to ensure that farmers reap optimal benefits from their hard work. The former Minister of Agriculture, Francis Kasaila released the agricultural commodity farm gate marketing prices and cautioned farmers against selling their agricultural commodities to middle men. The minimum farm gate prices are released at the start of each selling season.</p><p>The recommended minimum farm gate prices for selected crops for the 2019/2020 season are as follows: maize K200 per kg, rice K600 per kg, pure beans K450 per kg.</p>	Minimum Farm Gate Prices	\N	\N	2020-09-26 15:41:17.967+00	2020-09-26 15:41:17.987+00	5
20	msZkltfvMw0	Is the Mobile App a separate platform from the NAMIS?	<p>The Mobile NAMIS App is not a separate platform. Actually the mobile App complements the utility of the NAMIS in data collection.</p>	Mobile App a separate platform	\N	\N	2020-09-25 12:33:14.907+00	2020-09-25 12:33:14.918+00	11
13	MhwtzQJagip	Local Policies	This provides a repository of all relevant local policies concerning Agriculture in Malawi	Local Policies	\N	\N	2020-08-20 15:16:09.732+00	2020-08-20 15:16:09.737+00	4
8	tRZBCrgJCbn	What is AMIS?	<p>AMIS is one of the two NAMIS instances, specifically for agriculture market information</p>	What is AMIS?	\N	\N	2020-08-20 15:11:34.467+00	2020-08-20 15:24:24.543+00	7
15	qSYn2BhwLtB	International Policies & Documents	This provides a repository of all relevant international policies and documents concerning Agriculture in Malawi	International Policies & Documents	\N	\N	2020-08-20 15:16:53.249+00	2020-08-20 15:16:53.254+00	4
9	CloQO8VgrR9	Does NAMIS encompass all aspects of MoAFS data?	<p>Yes, it does. However, there are two instances; one instance handles data that is captured weekly, like the market surveys.</p>	Does NAMIS encompass all aspects of MoAFS data?	\N	\N	2020-08-20 15:13:03.344+00	2020-08-20 15:24:52.288+00	7
12	MxaWD7f9fIg	What role does the NAMIS mobile application play?	<p>The NAMIS mobile application is used to capture non-aggregate data; data that can be tracked.</p>	What role does the NAMIS mobile application play?	\N	\N	2020-08-20 15:14:55.675+00	2020-08-20 15:25:19.466+00	11
14	vdHlLGa6OjL	Local Reports & Documents	This provides a repository of all relevant reports and documentation concerning Agriculture in Malawi.	Local Reports & Documents	\N	\N	2020-08-20 15:16:33.427+00	2020-08-20 15:19:49.26+00	4
16	wGCJKNPjQ68	Working Documents or Papers	This is a repository of of all documentation currently under development. It provides access to working papers, including draft documents, such as draft policies, strategic plans, guidelines, concept papers, project proposals, and cabinet papers the ministry is working on at any particular time.	Working Documents	\N	\N	2020-08-20 15:17:29.944+00	2020-08-20 15:21:12.918+00	4
10	IxCGKij2U68	Is it possible to add a new data element to NAMIS or does it require some coding?	<p>Adding new data elements to NAMIS does not require any coding.</p>	Is it possible to add a new data element to NAMIS or does it require some coding?	\N	\N	2020-08-20 15:13:41.92+00	2020-08-20 15:25:50.56+00	7
6	FjNT2tsX9rq	FAQs	<p>In this Frequently Asked Questions page, we list the common questions you may ask about the National Agriculture Management Information System (NAMIS) for the Ministry of Agriculture and Food Security. We encourage you to check this page first on any issue before taking it up with relevant officers at the Ministry.</p>	FAQs	\N	1	2020-08-20 14:46:31.31+00	2020-09-30 07:59:45.191+00	\N
22	f19IoHF8HRM	Epizootic Ulcerative Syndrome (EUS) in fish!	<p>The Ministry of Agriculture, Irrigation and Water Development warned farmers about a suspected outbreak of a disease called Epizootic Ulcerative Syndrome (EUS) in fish at Dambo village, Mlonyeni Extension Planning Area (EPA) in Mchinji District within Kasungu ADD. The disease had already spread to other water bodies within Mchinji.</p>	Epizootic Ulcerative Syndrome (EUS) in fish	\N	\N	2020-09-26 15:41:42.934+00	2020-10-16 11:31:27.406+00	5
23	MDooskjqEAh	Vulnerable Farmers to Receive Subsidized Seeds, Fertilizer	<p>Some farmers cannot literally buy fertilizer even at&nbsp;the subsidized price of&nbsp;MK4,495.00 a bag. In light of this, two agricultural-based organizations, Yara International and Bayer Limited have ganged up to distribute free fertilizer and seed respectively to at least 50, 000 vulnerable farmers in the country. Yara International will distribute 100, 000 bags of NPK fertilizer while Bayer Limited will distribute quick maturing and drought-resistant hybrid maize seed to the targeted smallholder farmers.</p>	Vulnerable Farmers to Receive Subsidized Seeds, Fertilizer	\N	\N	2020-09-26 15:43:00.497+00	2020-09-26 15:43:00.508+00	5
24	pV9WDixke1J	NAMIS Implementation	<p>The Ministry of Agriculture and Food Security is implementing the National Agriculture Management Information System across the country.&nbsp;NAMIS is being supported by the Multi-Donor Trust Fund (MDTF), through the Agricultural Sector Wide Approach – Support Program II (ASWAp-SP II). ASWAp-SP II is aimed at improving the productivity and market access of selected commodities for small-holder farmers in targeted districts of Malawi. As a way of enhancing this initiative, the ministry has acquired over 2,500 tablets to be used by the AEDOs in the EPAs drawn from different sources (FAO, NSO and ASWap and SAPP). The implementation is being done in phases. Phase I was completed in December 2019 and currently MoFS is implementing Phase II.</p>	NAMIS Implementation	\N	\N	2020-09-28 07:43:08.228+00	2020-09-28 07:43:08.235+00	5
25	K41YWT7HKLA	Training of Trainers	<p>Twelve (12) Senior Officers from the Ministry of Agriculture and Food Security have just completed a Training of Trainers workshop in Salima. The team comprise members from Planning and ICT departments. The training mainly was on the Agriculture Market Information System (AMIS) which covers a total of 7 market surveys.</p>	Training of Trainers	\N	\N	2020-09-28 07:43:45.245+00	2020-09-28 07:43:45.25+00	5
26	q20nwdnrMfn	Ministry of Agriculture and Food Security to ease the work of AEDOs	<p>The Ministry of Agriculture and Food Security eases the work of data collection that is performed by the AEDOs as part of their day to day activities. The work will be eased with the introduction of an electronic system called NAMIS whose implementation is underway.</p>	Ministry of Agriculture and Food Security to ease the work of AEDOs	\N	\N	2020-09-28 07:44:14.263+00	2020-09-28 07:44:14.27+00	5
4	YoIt6rTm9WY	Library	The library provides access to a repository of key documents and selected policy research papers of national relevance. These documents include policies and strategies that the ministry uses to prioritize and plan activities at all its levels; research findings and reports published by the ministry and other agriculture research institutions that influence the policies and strategies; and reviews and evaluations of on-going and completed projects; and working papers, including draft documents, such as draft policies, strategic plans, guidelines, concept papers, project proposals, and cabinet papers. Some of these working papers will be restricted to high level government technicians and related partners except where approval has been granted to make them available to a wider audience	Library	\N	1	2020-08-20 14:44:58.216+00	2020-09-28 07:52:38.712+00	\N
\.


--
-- Data for Name: contacts; Type: TABLE DATA; Schema: public; Owner: namis
--

COPY public.contacts (id, _id, email, telephone, website, address, "createdAt", "updatedAt") FROM stdin;
1	J7WcN0Yfw1M	agriculture@agriculture.gov.mw	+265 (0) 1 788 738	https://www.agriculture.gov.mw	Ministry of Agriculture Headquarters, P.O. Box 30134, Capitol Hill, Lilongwe 	2020-09-28 08:31:06.409+00	2020-09-28 08:31:06.409+00
2	bgnVUsfoBQS	none	none	none	none	2020-09-28 08:32:24.826+00	2020-09-28 08:32:24.826+00
3	AavOYpSvlXU	moit@moit.gov.mw	+265 1 770 244	http://www.motpwh.gov.mw	Gemini House, City Centre, Lilongwe	2020-10-19 14:07:50.024+00	2020-10-19 14:07:50.024+00
4	SsBXiKmTZUW	hchimbali@worldbank.org	(202) 473-1001	https://www.worldbank.org	1818 H Street, NW Washington, DC 20433 USA	2020-10-19 14:17:08.449+00	2020-10-19 14:17:08.449+00
\.


--
-- Data for Name: documents; Type: TABLE DATA; Schema: public; Owner: namis
--

COPY public.documents (id, _id, name, description, size, path, filename, "createdAt", "updatedAt", "categoryId", "stakeholderId") FROM stdin;
1	C9Pq2eF8ssD	National Agriculture Policy	The National Agriculture Policy (NAP) defines the vision for development of the agricultural sector in Malawi that it will increasingly be oriented towards profitable commercial farming through specialization of smallholder farm production, output diversification at the national level, and value addition in downstream value chains. It guides the design of agricultural subsector policies, strategies, and other actions of the Government of Malawi for the short term by ensuring sustainable agricultural production, increased mechanisation, increased area under irrigation, increased agro-processing and value addition, enhanced risk management, strengthened marketing systems, accelerated export growth, and improved food security and nutrition. The NAP emphasises on achieving farmer-led agricultural transformation and commercialization that entails treating farming as a business. Thus, the policy facilitates and harnesses dynamic transitions taking place within farming communities, in particular the movement of farming households into non-traditional high-value agricultural value chains and increased engagement in profitable off-farm and non-agricultural livelihoods.	2125348	docs/file-1601035347340.pdf	file-1601035347340.pdf	2020-09-25 12:02:37.919+00	2020-09-25 12:02:37.942+00	13	\N
2	rkNTjhfwxsr	National Irrigation Policy	The agriculture sector is dependent almost entirely on subsistence rain-fed agriculture. The irrigation potential in the country remains, largely, unexploited. Out of the estimated potential of 407,862 hectares, only about 104,634 hectares have been developed for irrigation purposes representing 25% of the potential area. The limited area under irrigation results into low agricultural production and productivity leading to food deficits during periods of erratic rainfall patterns, dry spells, droughts and floods of which there has been increased frequency of occurrence due to climate change effects exacerbated by population growth. Considering policies of other related sectors, the revised National Irrigation Policy (NIP), thus, intends to support the migration of farmer organizations from subsistence to commercialization. Its overall goal is to contribute to sustainable national economic growth and development through enhanced irrigated agriculture production and productivity. To achieve the overall goal, the policy will focus on three priority areas namely, Sustainable Irrigation Development, Sustainable Irrigation Management and Capacity Development.	2125348	docs/file-1601035428435.pdf	file-1601035428435.pdf	2020-09-25 12:03:55.609+00	2020-09-25 12:03:55.614+00	13	\N
3	lU9e01qjnie	National Seed Policy	The seed sector has undergone massive transformation over the years due to the mushrooming of seed companies, agro-dealers, growers and other players involved in seed industry. Currently, the country has over 25 and 700 seed companies and agro-dealers respectively. The Seed Services Unit has inadequate capacity to cope with the increased demands as a regulator. The National Seed Policy (NSP) thus seeks to provide clear guidelines for the development and promotion of the seed industry to raise agricultural productivity through the provision of sustainable, adequate and high-quality seeds. This derives from the fact that effective seed trade is one of the essential components in the attainment of food security and that there is lack of access to high quality seed due to high seed prices, unavailability of high quality seed in the rural areas, and lack of credit facilities for farmers to buy high quality seed.	11370043	docs/file-1601035476908.pdf	file-1601035476908.pdf	2020-09-25 12:05:09.456+00	2020-09-25 12:05:09.488+00	13	\N
4	jC0X8M2l9nw	National Agriculture Investment Plan	The National Agriculture Investment Plan (NAIP) is a medium-term investment framework that succeeds and builds on the achievements and lessons learned from its predecessor the Agricultural Sector-Wide Approach (ASWAp). It is founded mainly on the Malawi Growth and Development Strategy (MGDS), the National Agricultural Policy (NAP), the CAADP Compact and the Malabo Declaration on the policy front and is aligned to the Malawi Growth and Development Strategy (MGDS III) serving as the main implementation vehicle for NAP. It is also aligned to the global Sustainable Development Goals (SDGs). Departing from its predecessor, NAIP adopts a matrix structure comprising four Programs aimed at i) improving policy and regulatory environment, stakeholder coordination and accountability; ii) strengthening resilience of livelihoods and natural resource base for agriculture; increasing production and productivity of a more diversified agricultural sector; and iv) enhancing market access, value addition, trade, and access to finance respectively. With the Ministry of Agriculture, Irrigation and Water Development (MoAIWD) as the lead implementing agency, NAIP provides a framework to coordinate and prioritise investments by government agencies, development partners, civil society, farmer organizations and the private sector.	7899709	docs/file-1601035563331.pdf	file-1601035563331.pdf	2020-09-25 12:06:29.806+00	2020-09-25 12:06:29.816+00	14	\N
5	H4yiKgu5Nrk	Conceptual Framework for the Design of the NAMIS	Coming from a background of lack of sound monitoring and evaluation (M&E) system capable of informing stakeholders on the progress of the National Agriculture Policy and National Agriculture Investment Plan (NAIP) implementation, in 2017, the Ministry of Agriculture, Irrigation and Water Development (MOAIWD) developed a concept paper to address this gap. It highlighted the need for a robust National Agriculture Management Information System (NAMIS) to inform decision-making in the agriculture sector by digitizing existing data collection systems within MoAIWD and integrating external agriculture data systems to which this library portal is deliverable. The concept envisaged efficient data collection; improved quality of existing data; and easier access and analysis of data through reports and dashboard visualizations. NAMIS is the single sector-wide system for monitoring the Malawi NAIP divided into 15 modules namely agricultural statistics; trade and marketing; climate change and meteorology; animal health and livestock; fisheries; water and irrigation; human resources; public agriculture activity monitoring; library; land resource management; and farmer organisations.	5179675	docs/file-1601035722466.pdf	file-1601035722466.pdf	2020-09-25 12:08:56.408+00	2020-09-25 12:08:56.416+00	14	\N
6	v3FRKGhvGE8	Malawi Growth and Development Strategy (MGDS) III	The Malawi Growth and Development Strategy (MGDS) III is the medium-term strategy designed to contribute to Malawi’s long-term development aspirations. The strategy covers a 5-year period beginning 2017. It is aimed at moving Malawi to a productive, competitive, and resilient nation through sustainable agriculture and economic growth, energy, industrial and infrastructure development while addressing water, climate change, environmental management, and population challenges. Recognising the youthfulness of the population in Malawi (73% less than 30 years of age), the strategy seeks to leverage  the energy and creativity of this demographic dividend to spar an uptick in productivity and economic growth to accelerate development of the country. The MGDS III while aligning to Malawi’s international, continental and regional obligations, emphasises on the need to invest simultaneously in areas that can spur growth through the following KPIs: i) Agriculture, Water Development and Climate Change Management; ii) Education and Skills Development; iii) Transport and ICT infrastructure; iv) Energy, Industry and Tourism Development and v) Health and Population.	31900807	docs/file-1601035780996.pdf	file-1601035780996.pdf	2020-09-25 12:11:04.189+00	2020-09-25 12:11:04.193+00	14	\N
8	RqBHhqQxRo4	Malabo Declaration on Accelerated Agricultural Growth and Transformation for Shared Prosperity and Improved Livelihoods	At the African Union Summit in Malabo, Equatorial Guinea in June 2014, Heads of State and Government adopted a remarkable set of concrete agriculture goals to be attained by 2025. The Malabo Declaration on Accelerated Agricultural Growth and Transformation for Shared Prosperity and Improved Livelihoods is a set of new goals showing a more targeted approach to achieve the agricultural vision for the continent which is shared prosperity and improved livelihoods. The Malabo Summit reconfirmed that agriculture should remain high on the development agenda of the continent and is a critical policy initiative for African economic growth and poverty reduction.	658099	docs/file-1601036010242.pdf	file-1601036010242.pdf	2020-09-25 12:13:34.985+00	2020-09-25 12:15:55.553+00	15	\N
10	OGbcB9xUoU6	Test Documentd	Test Document summarywd	1239935	docs/file-1601498682884.pdf	file-1601498682884.pdf	2020-09-30 20:44:45.407+00	2020-09-30 20:49:51.148+00	16	\N
7	Tw8SEzKU90O	Comprehensive African Agriculture Development Programme	The Comprehensive African Agriculture Development Programme (CAADP), launched July 2003 in Maputo, Mozambique, returned agriculture to the centre of national agenda. The Maputo Declaration called for the implementation of the new pan-African flagship programme of the New Partnership for Africa\'s Development (NEPAD): The Comprehensive African Agriculture Development Programme (CAADP). It was the vehicle to stimulate production and bring about food security among the populations of the African continent. The Maputo Declaration is remembered mostly for its commitment to allocating at least 10% of national budgetary resources to agriculture, to achieve 6% growth of the agriculture economy.	876734	docs/file-1601035904017.pdf	file-1601035904017.pdf	2020-09-25 12:11:48.724+00	2020-09-25 12:11:48.727+00	15	\N
9	moRwegBoYOr	Sustainable Development Goals 2030	In the year 2015, leaders from 193 countries of the world came together to face the future. And what they saw was daunting. Famines. Drought. Wars. Plagues. Poverty. Not just in some faraway place, but in their own cities and towns and villages. They knew things did not have to be this way. They knew we had enough food to feed the world, but that it was not getting shared. They knew there were medicines for HIV and other diseases, but they cost a lot. They knew that earthquakes and floods were inevitable, but that the high death tolls were not. They also knew that billions of people worldwide shared their hope for a better future. So, leaders from these countries created a plan called the Sustainable Development Goals (SDGs). This set of 17 goals imagines a future just 15 years off that would be rid of poverty and hunger, and safe from the worst effects of climate change. The United Nations Development Programme (UNDP) is one of the leading organizations working to fulfil the SDGs by the year 2030.	271509	docs/file-1601036060638.pdf	file-1601036060638.pdf	2020-09-25 12:14:22.857+00	2020-09-25 12:14:22.868+00	15	\N
16	fGBNvLDziJy	Farmer Organization Development Strategy 2020 - 2025	The Farmer Organization Development Strategy (FODS) has been formulated to provide a framework for developing sustainable farmer organizations (FOs) in Malawi. There are many benefits that are associated with having strong and sustainable farmer groups, which among others, include: increasing farmers’ bargaining power, enhancing farmers’ access to extension services and to input and output markets and improving social cohesion. Despite these benefits, Malawi’s efforts in developing various models of FOs have resulted in limited success partly due to lack of a clear strategy for a harmonized approach to FO development. The FODS fills this void by outlining strategic interventions that stakeholders in the sub-sector will need to implement to create sustainable and vibrant farmer organizations. 	1838920	docs/file-1609925343417.pdf	file-1609925343417.pdf	2021-01-06 09:29:05.559+00	2021-01-06 09:29:05.626+00	14	\N
12	zwF3jQ4iwnK	\N	\N	8786	docs/file-1602398578530.png	file-1602398578530.png	2020-10-11 06:42:58.535+00	2020-10-11 06:42:58.535+00	\N	\N
13	n00DjQquC5n	\N	\N	59986	docs/file-1603118049136.jpg	file-1603118049136.jpg	2020-10-19 14:34:09.819+00	2020-10-19 14:34:09.819+00	\N	\N
14	zzxeejnWEH9	\N	\N	34323	docs/file-1603118834945.png	file-1603118834945.png	2020-10-19 14:47:15.308+00	2020-10-19 14:47:15.308+00	\N	\N
15	qqpdhtbsMdf	Agriculture Sector Food and Nutrition Strategy 2020 - 2024	Food and nutrition security are imperative if Malawi is to achieve its development goals. The 2012 Cost of Hunger survey estimated that the annual cost associated with child undernutrition in Malawi is 10.3% of the Gross Domestic Product (GDP), equivalent to MK147 billion (597 million USD). The agriculture sector is crucial to achieving food and nutrition security as the main provider of food and water, which is the primary source of nutrition. Despite this, there is no evidence-based strategy detailing agriculture’s role in nutrition, so gains in agriculture productivity are not translating into optimal nutrition outcomes. The Agriculture Sector Food and Nutrition Strategy addresses this by detailing the agriculture sector’s roles, responsibilities, and activities with streamlined steps to improve nutrition outcomes.	1407664	docs/file-1609925122737.pdf	file-1609925122737.pdf	2021-01-06 09:25:24.63+00	2021-01-06 09:25:25.274+00	14	\N
17	G9aM5994J9v	National Agriculture Extension and Advisory Services Strategy 2020 - 2024	Most Malawians continue to rely on agriculture for their livelihoods. The smallholder sub-sector plays a dominant role in crop and livestock production for national and household food, nutrition, and income security. This calls for high quality agriculture extension and advisory services for increased production and productivity.  The National Agriculture Extension and Advisory Services Strategy is an outcome of an extensive consultative processes that emanated from the review of the National Agriculture Extension Policy (NAEP); “Agriculture Extension in the New Millennium: Towards Pluralistic and Demand-driven Services in Malawi” that was adopted in 2000 to guide implementation of agriculture extension services in Malawi. The policy created both opportunities and challenges for public and private sector organizations to provide services to farmers of different categories and interests and diverse needs.	3842553	docs/file-1609925532287.pdf	file-1609925532287.pdf	2021-01-06 09:32:17.907+00	2021-01-06 09:32:17.916+00	14	\N
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: namis
--

COPY public.roles (id, _id, name, description, "createdAt", "updatedAt") FROM stdin;
1	fAxvldUPeXU	writer	WRITER	2020-08-13 11:05:35.57+00	2020-08-13 11:05:35.57+00
2	LK91L4DmEl2	publisher	PUBLISHER	2020-08-13 11:05:35.57+00	2020-08-13 11:05:35.57+00
3	xvzZQ0vBbZ5	admin	ADMIN	2020-08-13 11:05:35.57+00	2020-08-13 11:05:35.57+00
\.


--
-- Data for Name: stakeholdercontacts; Type: TABLE DATA; Schema: public; Owner: namis
--

COPY public.stakeholdercontacts (id, stakeholderid, contactid, "createdAt", "updatedAt") FROM stdin;
1	2	1	2020-09-28 08:31:06.422+00	2020-09-28 08:31:06.422+00
3	4	3	2020-10-19 14:07:50.036+00	2020-10-19 14:07:50.036+00
4	5	4	2020-10-19 14:17:08.459+00	2020-10-19 14:17:08.459+00
\.


--
-- Data for Name: stakeholders; Type: TABLE DATA; Schema: public; Owner: namis
--

COPY public.stakeholders (id, _id, name, about, mission, vision, image, "createdAt", "updatedAt", "typeId") FROM stdin;
2	r4GS96gsZOW	Ministry of Agriculture	The Ministry of Agriculture, and Food Security (MOAFS) is one of the key ministries in the Malawi Government. Agriculture, being the mainstay of the country’s economy, makes the Ministry prominent in Malawi society in general, and in its contribution to the economy in particular.The Ministry is organized in 7 technical Departments namely Agriculture Extension Services, Crops Development, Animal Health and Industry, Agriculture Research, Agriculture Planning Services, Land Resource and Conservation, and Fisheries. The Ministry also includes Irrigation and Water Development, the government institution responsible for the water sub-sector.	None	None	/files/images/file-1602398578530.png	2020-09-28 08:31:06.404+00	2020-10-11 06:42:58.633+00	\N
5	qq5rLKW3ll3	World Bank	The World Bank is like a cooperative, made up of 189 member countries. These member countries, or shareholders, are represented by a Board of Governors, who are the ultimate policymakers at the World Bank. Generally, the governors are member countries' ministers of finance or ministers of development. They meet once a year at the Annual Meetings of the Boards of Governors of the World Bank Group and the International Monetary Fund.	The World Bank Group has two ambitious goals: End extreme poverty within a generation and boost shared prosperity.	None 	/files/images/file-1603118049136.jpg	2020-10-19 14:17:08.44+00	2020-10-19 14:34:09.843+00	\N
4	gIPpoC3854S	Ministry of Trade	The Ministry of Industry, Trade and Tourism was established to develop policies that would create economic regulatory environment that would be conducive to promoting industry and trade and tourism as well as promoting Malawi products both on local and international markets. The Ministry is mandated to empower Malawians including small and medium enterprises (SMES) and cooperatives to participate in economic activities.	To promote, support and facilitate the development of industry, trade, and a vibrant tourism industry in both existing and potential growth sectors, thereby increasing the supply of value-added goods and services for domestic and international markets	A dynamic, innovative, and globally competitive economy	/files/images/file-1603118834945.png	2020-10-19 14:07:49.999+00	2020-10-19 14:47:15.315+00	\N
\.


--
-- Data for Name: types; Type: TABLE DATA; Schema: public; Owner: namis
--

COPY public.types (id, _id, name, about, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: userroles; Type: TABLE DATA; Schema: public; Owner: namis
--

COPY public.userroles (id, userid, roleid, "createdAt", "updatedAt") FROM stdin;
2	3	1	2020-08-13 11:33:42.494+00	2020-08-13 11:33:42.494+00
3	3	2	2020-08-13 11:33:42.494+00	2020-08-13 11:33:42.494+00
4	3	3	2020-08-13 11:33:42.494+00	2020-08-13 11:33:42.494+00
5	5	1	2020-08-20 15:07:10.137+00	2020-08-20 15:07:10.137+00
6	5	2	2020-08-20 15:07:10.137+00	2020-08-20 15:07:10.137+00
14	6	3	2020-09-17 20:29:34.061+00	2020-09-17 20:29:34.061+00
15	6	1	2020-09-17 20:29:34.061+00	2020-09-17 20:29:34.061+00
16	8	2	2021-01-19 13:33:30.704+00	2021-01-19 13:33:30.704+00
17	8	3	2021-01-19 13:33:30.704+00	2021-01-19 13:33:30.704+00
21	12	1	2021-01-19 17:31:49.259+00	2021-01-19 17:31:49.259+00
22	12	2	2021-01-19 17:31:49.259+00	2021-01-19 17:31:49.259+00
23	12	3	2021-01-19 17:31:49.259+00	2021-01-19 17:31:49.259+00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: namis
--

COPY public.users (id, _id, username, firstname, lastname, email, password, "resetPasswordExpires", "resetPasswordToken", "createdAt", "updatedAt") FROM stdin;
3	sQ7AOYFTpJ0	Admin	Superuser	Superuser	mishukran@gmail.com	$2a$10$tg5HgdwJqwElCWGUecJgEufWvZLR9DFpGpogYQKf5IBEl2B8Im8/u	\N	\N	2020-08-13 11:33:42.347+00	2020-08-13 11:33:42.347+00
5	wlAE51IXts2	ckanjo	Chipo	Kanjo	ckanjo@cc.ac.mw	$2a$10$MCHj5V8Grxcmws1cFGb/z.Z5GmOAor/Q/8eFhcCj753mDHLOFvFpm	\N	\N	2020-08-20 15:05:49.245399+00	2020-08-20 15:05:49.245399+00
6	M0LlsTlALox	KMunthali	KMunthali	KMunthali	kmunthali@cc.ac.mw	$2a$10$/GbZS6x2cdCUVOm4zl4KNOepx2VG/y0VzG6D0pn9.h27e2eWRLIdG	\N	\N	2020-09-17 20:29:33.875+00	2020-09-17 20:29:33.875+00
8	P8qvf9XhrNC	JohnDoe	John	Mwakabira	imwakabira@ymail.com	$2a$10$4DjiGAw1Y6fp1Dif38xgpezAYLsMJrTz6DAkq0EDaeO0.MRoxCOaC	\N	\N	2021-01-19 13:33:30.474+00	2021-01-19 13:33:30.474+00
12	h9E82aW0O2M	ShukranIsaac	Isaac	Mwakabira	imwakabira@cc.ac.mw	$2a$10$yd2wU1mYuswW/vGazpCpneE1r4K5/y/Kw6OsN67Lb7Mu1X2DzOAGe	\N	\N	2021-01-19 17:31:49.116+00	2021-01-19 17:31:49.116+00
\.


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: namis
--

SELECT pg_catalog.setval('public.categories_id_seq', 26, true);


--
-- Name: contacts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: namis
--

SELECT pg_catalog.setval('public.contacts_id_seq', 4, true);


--
-- Name: documents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: namis
--

SELECT pg_catalog.setval('public.documents_id_seq', 17, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: namis
--

SELECT pg_catalog.setval('public.roles_id_seq', 3, true);


--
-- Name: stakeholdercontacts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: namis
--

SELECT pg_catalog.setval('public.stakeholdercontacts_id_seq', 4, true);


--
-- Name: stakeholders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: namis
--

SELECT pg_catalog.setval('public.stakeholders_id_seq', 5, true);


--
-- Name: types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: namis
--

SELECT pg_catalog.setval('public.types_id_seq', 1, false);


--
-- Name: userroles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: namis
--

SELECT pg_catalog.setval('public.userroles_id_seq', 23, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: namis
--

SELECT pg_catalog.setval('public.users_id_seq', 12, true);


--
-- Name: categories categories__id_key; Type: CONSTRAINT; Schema: public; Owner: namis
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories__id_key UNIQUE (_id);


--
-- Name: categories categories_name_key; Type: CONSTRAINT; Schema: public; Owner: namis
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key UNIQUE (name);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: namis
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: contacts contacts__id_key; Type: CONSTRAINT; Schema: public; Owner: namis
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts__id_key UNIQUE (_id);


--
-- Name: contacts contacts_email_key; Type: CONSTRAINT; Schema: public; Owner: namis
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_email_key UNIQUE (email);


--
-- Name: contacts contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: namis
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_pkey PRIMARY KEY (id);


--
-- Name: contacts contacts_telephone_key; Type: CONSTRAINT; Schema: public; Owner: namis
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_telephone_key UNIQUE (telephone);


--
-- Name: documents documents__id_key; Type: CONSTRAINT; Schema: public; Owner: namis
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents__id_key UNIQUE (_id);


--
-- Name: documents documents_name_key; Type: CONSTRAINT; Schema: public; Owner: namis
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_name_key UNIQUE (name);


--
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: namis
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- Name: roles roles__id_key; Type: CONSTRAINT; Schema: public; Owner: namis
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles__id_key UNIQUE (_id);


--
-- Name: roles roles_description_key; Type: CONSTRAINT; Schema: public; Owner: namis
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_description_key UNIQUE (description);


--
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: namis
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: namis
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: stakeholdercontacts stakeholdercontacts_pkey; Type: CONSTRAINT; Schema: public; Owner: namis
--

ALTER TABLE ONLY public.stakeholdercontacts
    ADD CONSTRAINT stakeholdercontacts_pkey PRIMARY KEY (id);


--
-- Name: stakeholdercontacts stakeholdercontacts_stakeholderid_contactid_key; Type: CONSTRAINT; Schema: public; Owner: namis
--

ALTER TABLE ONLY public.stakeholdercontacts
    ADD CONSTRAINT stakeholdercontacts_stakeholderid_contactid_key UNIQUE (stakeholderid, contactid);


--
-- Name: stakeholders stakeholders__id_key; Type: CONSTRAINT; Schema: public; Owner: namis
--

ALTER TABLE ONLY public.stakeholders
    ADD CONSTRAINT stakeholders__id_key UNIQUE (_id);


--
-- Name: stakeholders stakeholders_image_key; Type: CONSTRAINT; Schema: public; Owner: namis
--

ALTER TABLE ONLY public.stakeholders
    ADD CONSTRAINT stakeholders_image_key UNIQUE (image);


--
-- Name: stakeholders stakeholders_name_key; Type: CONSTRAINT; Schema: public; Owner: namis
--

ALTER TABLE ONLY public.stakeholders
    ADD CONSTRAINT stakeholders_name_key UNIQUE (name);


--
-- Name: stakeholders stakeholders_pkey; Type: CONSTRAINT; Schema: public; Owner: namis
--

ALTER TABLE ONLY public.stakeholders
    ADD CONSTRAINT stakeholders_pkey PRIMARY KEY (id);


--
-- Name: types types__id_key; Type: CONSTRAINT; Schema: public; Owner: namis
--

ALTER TABLE ONLY public.types
    ADD CONSTRAINT types__id_key UNIQUE (_id);


--
-- Name: types types_name_key; Type: CONSTRAINT; Schema: public; Owner: namis
--

ALTER TABLE ONLY public.types
    ADD CONSTRAINT types_name_key UNIQUE (name);


--
-- Name: types types_pkey; Type: CONSTRAINT; Schema: public; Owner: namis
--

ALTER TABLE ONLY public.types
    ADD CONSTRAINT types_pkey PRIMARY KEY (id);


--
-- Name: userroles userroles_pkey; Type: CONSTRAINT; Schema: public; Owner: namis
--

ALTER TABLE ONLY public.userroles
    ADD CONSTRAINT userroles_pkey PRIMARY KEY (id);


--
-- Name: userroles userroles_userid_roleid_key; Type: CONSTRAINT; Schema: public; Owner: namis
--

ALTER TABLE ONLY public.userroles
    ADD CONSTRAINT userroles_userid_roleid_key UNIQUE (userid, roleid);


--
-- Name: users users__id_key; Type: CONSTRAINT; Schema: public; Owner: namis
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users__id_key UNIQUE (_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: namis
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: namis
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_resetPasswordToken_key; Type: CONSTRAINT; Schema: public; Owner: namis
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_resetPasswordToken_key" UNIQUE ("resetPasswordToken");


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: namis
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: categories categories_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: namis
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "categories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: documents documents_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: namis
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT "documents_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: documents documents_stakeholderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: namis
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT "documents_stakeholderId_fkey" FOREIGN KEY ("stakeholderId") REFERENCES public.stakeholders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: stakeholdercontacts stakeholdercontacts_contactid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: namis
--

ALTER TABLE ONLY public.stakeholdercontacts
    ADD CONSTRAINT stakeholdercontacts_contactid_fkey FOREIGN KEY (contactid) REFERENCES public.contacts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: stakeholdercontacts stakeholdercontacts_stakeholderid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: namis
--

ALTER TABLE ONLY public.stakeholdercontacts
    ADD CONSTRAINT stakeholdercontacts_stakeholderid_fkey FOREIGN KEY (stakeholderid) REFERENCES public.stakeholders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: stakeholders stakeholders_typeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: namis
--

ALTER TABLE ONLY public.stakeholders
    ADD CONSTRAINT "stakeholders_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES public.types(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: userroles userroles_roleid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: namis
--

ALTER TABLE ONLY public.userroles
    ADD CONSTRAINT userroles_roleid_fkey FOREIGN KEY (roleid) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: userroles userroles_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: namis
--

ALTER TABLE ONLY public.userroles
    ADD CONSTRAINT userroles_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

