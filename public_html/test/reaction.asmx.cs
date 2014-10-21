using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using Oracle.DataAccess.Client;
using System.Data;
using com.ggasoftware.indigo;
using System.Drawing;
using System.IO;
using System.Web.Script.Serialization;
using System.Web.Script.Services;
using com.ggasoftware.indigo;

namespace WebService
{
    /// <summary>
    /// Summary description for Reaction
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class Reaction : System.Web.Services.WebService
    {
        string conn = "Data Source=eln;Persist Security Info=True;User ID=CEN_DEV_OWNER;Password=CEN_DEV_OWNER";
        //string conn = "Data Source=elnRemote;Persist Security Info=True;User ID=CEN_DEV_OWNER;Password=CEN_DEV_OWNER";


        [WebMethod(Description = "check login")]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string checkBatchExistChemeln(string batch)
        {
            OracleConnection cn = new OracleConnection();
            if (cn.State != ConnectionState.Open)
            {
                cn.ConnectionString = conn;
                cn.Open();
            }

            OracleCommand command = new OracleCommand();
            command.Connection = cn;

            try
            {
                OracleCommand oraCommand = new OracleCommand("select batch_number from CEN_BATCHES where batch_number = '" + batch + "'", command.Connection);
                OracleDataReader reader = oraCommand.ExecuteReader();
                DataTable dt = new DataTable();
                dt.Load(reader);
                if (dt.Rows.Count > 0)
                {
                    return "Y";
                }
                else
                {
                    return "N";
                }

            }
            catch (Exception ex)
            {
                throw ex;

            }
            finally
            {
                if (cn.State.Equals(System.Data.ConnectionState.Open)) { cn.Close(); }
            }
            return "";
        }
        
        [WebMethod(Description = "check login")]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string checkBatchExistChemtools(string batch)
        {
            string serv = System.Environment.MachineName;
            if (serv == "GIPPO-PC")
            {
                return "N";
            }
            OracleConnection cn = new OracleConnection();
            if (cn.State != ConnectionState.Open)
            {
                cn.ConnectionString = "Data Source=nmsdd;Persist Security Info=True;User ID=mar;Password=nervi";
                cn.Open();
            }

            OracleCommand command = new OracleCommand();
            command.Connection = cn;

            try
            {
                OracleCommand oraCommand = new OracleCommand("select batch from mar_corp_lot_t where batch = '" + batch + "'", command.Connection);
                OracleDataReader reader = oraCommand.ExecuteReader();
                DataTable dt = new DataTable();
                dt.Load(reader);
                if (dt.Rows.Count > 0)
                {
                    return "Y";
                }
                else
                {
                    return "N";
                }

            }
            catch (Exception ex)
            {
                throw ex;

            }
            finally
            {
                if (cn.State.Equals(System.Data.ConnectionState.Open)) { cn.Close(); }
            }
            return "";
        }

        [WebMethod(Description = "check login")]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public string checkUserPwd(string username, string password)
        {
            string serv = System.Environment.MachineName;
            if (serv == "GIPPO-PC")
            {
                return "OK";                
            }
            OracleConnection cn = new OracleConnection();
            if (cn.State != ConnectionState.Open)
            {
                cn.ConnectionString = "Data Source=nmsdd;Persist Security Info=True;User ID=" + username + ";Password=" + password;
                cn.Open();
            }

            OracleCommand command = new OracleCommand();
            command.Connection = cn;

            try
            {
                OracleCommand oraCommand = new OracleCommand("select * from mar_corp_lot_t where batch = 'CCN1'", command.Connection);
                OracleDataReader reader = oraCommand.ExecuteReader();
                DataTable dt = new DataTable();
                dt.Load(reader);
                if (dt.Rows.Count > 0)
                {
                    return "OK";
                }
                else
                {
                    return "";
                }

            }
            catch (Exception ex)
            {
                throw ex;

            }
            finally
            {
                if (cn.State.Equals(System.Data.ConnectionState.Open)) { cn.Close(); }
            }
            return "";
        }

        //public string Enumeration(string rxnQuery, string[][] r1, string[] r2)

        [WebMethod(Description = "get products access indigo")]
        public string CreateReaction(string rxn, string product, string reagent)
        {
            com.ggasoftware.indigo.Indigo indigo = new Indigo();
            IndigoRenderer indigoRenderer = new IndigoRenderer(indigo);
            IndigoObject reaz;
            if (rxn.Length > 150)
            {
                reaz = indigo.loadReaction(rxn);                
            }
            else
            {
                reaz = indigo.createReaction();
            }
            if (product!="")
            {
                reaz.addProduct(indigo.loadMolecule(product));
            }
            if (reagent != "")
            {
                reaz.addReactant(indigo.loadMolecule(reagent));
            }

            string ret = reaz.rxnfile();
            return ret;
        }


        [WebMethod(Description = "Reaction Decomposition")]
        public string Decomposition()
        {
            string ret = "";
            Indigo indigo = new Indigo();
            IndigoObject scaf = indigo.loadQueryMoleculeFromFile(HttpContext.Current.Server.MapPath(".") + "\\" + "misto.mol");
            IndigoObject decomposer = indigo.createDecomposer(scaf);
            IndigoObject saver = indigo.writeFile((HttpContext.Current.Server.MapPath(".") + "\\" + "structures.sdf"));


            foreach (IndigoObject mol1 in indigo.iterateSDFile(HttpContext.Current.Server.MapPath(".") + "\\" + "misto.sdf"))
            {
                //mol1.unfoldHydrogens();

                IndigoObject deco_item1 = decomposer.decomposeMolecule(mol1);
                foreach (IndigoObject q_match in deco_item1.iterateDecompositions())
                {
                    IndigoObject rg_mol = q_match.decomposedMoleculeWithRGroups();
                    //decomposer.addDecomposition(q_match);
                }
                IndigoObject mol = deco_item1.decomposedMoleculeHighlighted();

                deco_item1.decomposedMoleculeWithRGroups().saveMolfile(HttpContext.Current.Server.MapPath(".") + "\\" + "molrgoups1.mol");
                deco_item1.decomposedMoleculeHighlighted().saveMolfile(HttpContext.Current.Server.MapPath(".") + "\\" + "highlighted1.mol");
                deco_item1.decomposedMoleculeScaffold().saveMolfile(HttpContext.Current.Server.MapPath(".") + "\\" + "scaffold1.mol");
                int count = 0;

                Dictionary<string, string> reag = new Dictionary<string, string>();

                reag.Add("STRUCTURE", deco_item1.decomposedMoleculeHighlighted().molfile());

                IndigoRenderer indigoRenderer = new IndigoRenderer(indigo);
                indigo.setOption("render-grid-title-property", "Enumeration");
                indigo.setOption("render-coloring", "true");

                Bitmap image = indigoRenderer.renderToBitmap(deco_item1.decomposedMoleculeHighlighted());
                string base64String;
                using (MemoryStream ms = new MemoryStream())
                {
                    // Convert Image to byte[]
                    image.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
                    byte[] imageBytes = ms.ToArray();

                    // Convert byte[] to Base64 String
                    base64String = Convert.ToBase64String(imageBytes);
                }

                reag.Add("STRUCTURE_IMAGE", base64String);

                foreach (IndigoObject rg in deco_item1.decomposedMoleculeWithRGroups().iterateRGroups())
                {
                    foreach (IndigoObject frag in rg.iterateRGroupFragments())
                    {
                        count++;
                        frag.saveMolfile(HttpContext.Current.Server.MapPath(".") + "\\" + "mol1frag" + count + ".mol");
                        mol.setProperty("R" + count, frag.molfile());
                        mol.setProperty("RS" + count, frag.smiles());

                        reag.Add("R" + count, frag.molfile());
                        reag.Add("RS" + count, frag.smiles());
                        image = indigoRenderer.renderToBitmap(frag);
                        using (MemoryStream ms = new MemoryStream())
                        {
                            // Convert Image to byte[]
                            image.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
                            byte[] imageBytes = ms.ToArray();

                            // Convert byte[] to Base64 String
                            base64String = Convert.ToBase64String(imageBytes);
                        }

                        reag.Add("R_IMAGE" + count, base64String);
                    }
                }
                saver.sdfAppend(mol);



                JavaScriptSerializer js = new JavaScriptSerializer();
                string json = js.Serialize(reag);

                ret = ret + json + ",";
            }

            IndigoObject scaffold = decomposer.decomposedMoleculeScaffold();
            scaffold.saveMolfile(HttpContext.Current.Server.MapPath(".") + "\\" + "full_scaffold.mol");
            indigo.Dispose();

            ret = ret.TrimEnd(',');

            return "[" + ret + "]";
        }

        [WebMethod(Description = "Reaction Decomposition")]
        public string DecompositionTest()
        {
            Indigo indigo = new Indigo();
            IndigoObject scaf = indigo.loadQueryMoleculeFromFile(HttpContext.Current.Server.MapPath(".") + "\\" + "query.mol");
            IndigoObject decomposer = indigo.createDecomposer(scaf);

            IndigoObject saver = indigo.writeFile((HttpContext.Current.Server.MapPath(".") + "\\" + "structures.sdf"));

            //IndigoObject mol = indigo.loadMolecule("C1CCC1");
            //mol.setName("cyclobutane");
            //mol.setProperty("id", "8506");
            //saver.sdfAppend(mol);

            IndigoObject mol1 = indigo.loadMoleculeFromFile(HttpContext.Current.Server.MapPath(".") + "\\" + "mol1.mol");
            IndigoObject deco_item1 = decomposer.decomposeMolecule(mol1);
            //deco_item1.iterateDecomposedMolecules
            //deco_item1.iterateRGroupFragments
            //deco_item1.iterateRGroups
            IndigoObject mol = deco_item1.decomposedMoleculeHighlighted();
            deco_item1.decomposedMoleculeWithRGroups().saveMolfile(HttpContext.Current.Server.MapPath(".") + "\\" + "molrgoups1.mol");
            deco_item1.decomposedMoleculeHighlighted().saveMolfile(HttpContext.Current.Server.MapPath(".") + "\\" + "highlighted1.mol");
            deco_item1.decomposedMoleculeScaffold().saveMolfile(HttpContext.Current.Server.MapPath(".") + "\\" + "scaffold1.mol");
            int count = 0;
            foreach (IndigoObject rg in deco_item1.decomposedMoleculeWithRGroups().iterateRGroups())
            {
                foreach (IndigoObject frag in rg.iterateRGroupFragments())
                {
                    count++;
                    frag.saveMolfile(HttpContext.Current.Server.MapPath(".") + "\\" + "mol1frag" + count + ".mol");
                    mol.setProperty("R" + count, frag.molfile());
                    mol.setProperty("RS" + count, frag.smiles());
                }
            }
            saver.sdfAppend(mol);

            IndigoObject mol2 = indigo.loadMoleculeFromFile(HttpContext.Current.Server.MapPath(".") + "\\" + "mol2.mol");
            IndigoObject deco_item2 = decomposer.decomposeMolecule(mol2);
            mol = deco_item2.decomposedMoleculeHighlighted();
            deco_item2.decomposedMoleculeWithRGroups().saveMolfile(HttpContext.Current.Server.MapPath(".") + "\\" + "molrgoups2.mol");
            deco_item2.decomposedMoleculeHighlighted().saveMolfile(HttpContext.Current.Server.MapPath(".") + "\\" + "highlighted2.mol");
            deco_item2.decomposedMoleculeScaffold().saveMolfile(HttpContext.Current.Server.MapPath(".") + "\\" + "scaffold2.mol");
            count = 0;
            foreach (IndigoObject rg in deco_item2.decomposedMoleculeWithRGroups().iterateRGroups())
            {
                foreach (IndigoObject frag in rg.iterateRGroupFragments())
                {
                    count++;
                    frag.saveMolfile(HttpContext.Current.Server.MapPath(".") + "\\" + "mol2frag" + count + ".mol");
                    mol.setProperty("R" + count, frag.molfile());
                    mol.setProperty("RS" + count, frag.smiles());

                }
            }
            saver.sdfAppend(mol);

            IndigoObject scaffold = decomposer.decomposedMoleculeScaffold();
            scaffold.saveMolfile(HttpContext.Current.Server.MapPath(".") + "\\" + "full_scaffold.mol");
            return "";
        }

        [WebMethod(Description = "delete full   experiment")]
        public string DelExperiment(string notebook, string page)
        {
            OracleConnection cn = new OracleConnection();
            if (cn.State != ConnectionState.Open)
            {
                cn.ConnectionString = conn;
                cn.Open();
            }

            OracleCommand command = new OracleCommand();
            command.Connection = cn;
            command.BindByName = true;
            command.CommandText = "CEN_DEV_OWNER.reg.delete_experiment";

            command.CommandType = CommandType.StoredProcedure;
            OracleParameter ret = new OracleParameter("ret", OracleDbType.Varchar2);
            ret.Size = 5;
            ret.Direction = ParameterDirection.Output;

            OracleParameter rxnIdo = new OracleParameter("nb", OracleDbType.Varchar2);
            rxnIdo.Direction = ParameterDirection.Input;
            rxnIdo.Value = notebook;

            OracleParameter rxno = new OracleParameter("exper", OracleDbType.Varchar2);
            rxno.Direction = ParameterDirection.Input;
            rxno.Value = page;

            command.Parameters.Add(rxnIdo);
            command.Parameters.Add(rxno);
            command.Parameters.Add(ret);

            DataSet tmprd = new DataSet("Structure");
            try
            {
                command.ExecuteNonQuery();
                return ret.Value.ToString();
            }
            catch (Exception ex)
            {
                throw ex;

            }
            finally
            {
                if (cn.State.Equals(System.Data.ConnectionState.Open)) { cn.Close(); }
            }
            return "";
        }

        [WebMethod(Description = "delete full   experiment")]
        public string DelAttachement(string notebook, string page, string user0, string namedoc0)
        {
            OracleConnection cn = new OracleConnection();
            if (cn.State != ConnectionState.Open)
            {
                cn.ConnectionString = conn;
                cn.Open();
            }

            OracleCommand command = new OracleCommand();
            command.Connection = cn;
            command.BindByName = true;
            command.CommandText = "CEN_DEV_OWNER.reg.delete_attachement";

            command.CommandType = CommandType.StoredProcedure;
            OracleParameter ret = new OracleParameter("ret", OracleDbType.Varchar2);
            ret.Size = 5;
            ret.Direction = ParameterDirection.Output;

            OracleParameter nb = new OracleParameter("nb", OracleDbType.Varchar2);
            nb.Direction = ParameterDirection.Input;
            nb.Value = notebook;

            OracleParameter exper = new OracleParameter("exper", OracleDbType.Varchar2);
            exper.Direction = ParameterDirection.Input;
            exper.Value = page;

            OracleParameter user = new OracleParameter("username", OracleDbType.Varchar2);
            user.Direction = ParameterDirection.Input;
            user.Value = user0;

            OracleParameter namedoc = new OracleParameter("namedoc", OracleDbType.Varchar2);
            namedoc.Direction = ParameterDirection.Input;
            namedoc.Value = namedoc0;

            command.Parameters.Add(nb);
            command.Parameters.Add(exper);
            command.Parameters.Add(ret);
            command.Parameters.Add(user);
            command.Parameters.Add(namedoc);

            DataSet tmprd = new DataSet("Structure");
            try
            {
                command.ExecuteNonQuery();
                return ret.Value.ToString();
            }
            catch (Exception ex)
            {
                throw ex;

            }
            finally
            {
                if (cn.State.Equals(System.Data.ConnectionState.Open)) { cn.Close(); }
            }
            return "";
        }

        [WebMethod(Description = "Reaction Enumeration")]
        public string Enumeration(string[] list, string rxnQ)
        {
            Indigo indigo = new Indigo();
            string fnA = HttpContext.Current.Server.MapPath(".") + "\\" + System.IO.Path.GetRandomFileName();
            IndigoObject saver = indigo.writeFile(fnA + ".sdf");

            for (int i = 0; i < list.Length; i++)
            {
                 System.IO.File.WriteAllText(fnA + i.ToString(), list[i]);                
            }
            IndigoObject reaction = indigo.loadQueryReaction(rxnQ);

            IndigoObject monomers_table = indigo.createArray();
            for (int i = 0; i < list.Length; i++)
            {
                monomers_table.arrayAdd(indigo.createArray());
                foreach (IndigoObject structure in indigo.iterateSDFile(fnA + i.ToString()))
                { monomers_table.at(i).arrayAdd(structure); }
            }

            IndigoObject output_reactions = indigo.reactionProductEnumerate(reaction, monomers_table);
            IndigoRenderer indigoRenderer = new IndigoRenderer(indigo);
            indigo.setOption("render-grid-title-property", "Enumeration");
            indigo.setOption("render-coloring", "true");

            string ret = "";
            foreach (IndigoObject item in output_reactions.iterateArray())
            {
                
                Dictionary<string, string>[] reag = new Dictionary<string, string>[] 
                        {
                            new Dictionary<string, string>(),
                            new Dictionary<string, string>()
                        };

                IndigoObject m = indigo.loadReaction(item.rxnfile());
                Bitmap image = indigoRenderer.renderToBitmap(m);
                using (MemoryStream ms = new MemoryStream())
                {
                    // Convert Image to byte[]
                    image.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
                    byte[] imageBytes = ms.ToArray();

                    // Convert byte[] to Base64 String
                    string base64String = Convert.ToBase64String(imageBytes);
                    //return base64String;
                    reag[0].Add("Image", base64String);
                    reag[1].Add("RXN", item.rxnfile());

                    JavaScriptSerializer js = new JavaScriptSerializer();
                    string json = js.Serialize(reag);

                    ret = ret + json + ",";
                }
            }
            foreach (IndigoObject item in output_reactions.iterateArray())
            {
                foreach (IndigoObject item1 in item.iterateProducts())
                {
                    saver.sdfAppend(item1); 
                }
            }
            saver.Dispose();
            indigo.Dispose();
            for (int i = 0; i < list.Length; i++)
            {
                File.Delete(fnA + i.ToString());
            }

            ret = ret.TrimEnd(',');
            return "[" + ret + "]";
        }

        [WebMethod(Description = "get reagents access indigo")]
        public string FromReactionToMolecules(string rxn)
        {
            com.ggasoftware.indigo.Indigo indigo = new Indigo();
            IndigoRenderer indigoRenderer = new IndigoRenderer(indigo);
            IndigoObject m = indigo.loadReaction(rxn);

            string ret = "";
            int count = 0;
            foreach (IndigoObject item in m.iterateReactants())
            {
                count++;
                Dictionary<string, string> molecules = new Dictionary<string, string>();
                item.setName("Reactant"+count.ToString());
                molecules.Add("rxn", item.molfile());

                JavaScriptSerializer js = new JavaScriptSerializer();
                string json = js.Serialize(molecules);

                ret = ret + json + ",";
            }

            count = 0;
            foreach (IndigoObject item in m.iterateProducts())
            {
                count++;
                Dictionary<string, string> molecules = new Dictionary<string, string>();
                item.setName("Product" + count.ToString());
                molecules.Add("rxn", item.molfile());

                JavaScriptSerializer js = new JavaScriptSerializer();
                string json = js.Serialize(molecules);

                ret = ret + json + ",";
            }

            ret = ret.TrimEnd(',');

            return "[" + ret + "]";
        }

        [WebMethod(Description = "get reagents")]
        public string GetAll(string compound)
        {
            OracleConnection cn = new OracleConnection();
            if (cn.State != ConnectionState.Open)
            {
                cn.ConnectionString = conn;
                cn.Open();
            }


            DataTable ret = MatchBingoReactionDt(compound, "Exact", "");

            OracleCommand command = new OracleCommand();
            command.Connection = cn;

            try
            {
                foreach (DataRow item in ret.Rows)
                {
                    OracleCommand oraCommand = new OracleCommand("SELECT 'Reactions' as Database, RXN_SCHEME_KEY as id, "+
                       "(SELECT fullname "+
                       "   FROM cen_users "+
                       "  WHERE username = (SELECT username "+
                       "                      FROM cen_pages "+
                       "                     WHERE page_key = r.page_key)) "+
                       "   AS username, "+
                       "(SELECT notebook "+
                       "   FROM cen_pages "+
                       "  WHERE page_key = r.page_key) "+
                       "   || '-' || "+
                       "(SELECT experiment "+
                       "   FROM cen_pages "+
                       "  WHERE page_key = r.page_key) "+
                       "   AS page, "+
                       "(SELECT creation_date "+
                       "   FROM cen_pages "+
                       "  WHERE page_key = r.page_key) "+
                       "   AS creation_date, "+
                       "(SELECT subject "+
                       "   FROM cen_pages "+
                       "  WHERE page_key = r.page_key) "+
                       "   AS subject "+
                       " FROM cen_reaction_schemes r " +
                       " WHERE RXN_SCHEME_KEY = '" + item.ItemArray[0] + "'", command.Connection);

                    OracleDataReader reader = oraCommand.ExecuteReader();
                    DataTable dt = new DataTable();
                    dt.Load(reader);

                    if (dt.Rows.Count > 0)
                    {
                        string js = "";
                        js = Utility.GetJson(dt);
                        return js;
                    }
                    else
                    {
                        return "";
                    }
                }

            }
            catch (Exception ex)
            {
                throw ex;

            }
            finally
            {
                if (cn.State.Equals(System.Data.ConnectionState.Open)) { cn.Close(); }
            }
            return "";
        }

        [WebMethod(Description = "get Attachement")]
        public string GetAttachement(string attacKey)
        {
            string fileName = "";
            OracleConnection cn = new OracleConnection();
            if (cn.State != ConnectionState.Open)
            {
                cn.ConnectionString = conn;
                cn.Open();
            }

            OracleCommand command = new OracleCommand();
            command.Connection = cn;

            try
            {
                string sql = "select  BLOB_DATA, ORIGINAL_FILE_NAME from CEN_ATTACHEMENTS where ATTACHEMENT_KEY = '" + attacKey + "'";

                OracleCommand oraCommand = new OracleCommand(sql, command.Connection);
                OracleDataReader reader = oraCommand.ExecuteReader();
                using(reader)
                {
                      //Obtain the first row of data.
                      reader.Read();
                      //Obtain the LOBs (all 3 varieties).
                      //Oracle.DataAccess.Types.OracleBlob BLOB = reader.GetOracleBlob(1);

                      FileStream fs;                          // Writes the BLOB to a file (*.bmp).
                      BinaryWriter bw;                        // Streams the BLOB to the FileStream object.
                      int bufferSize = 100;                   // Size of the BLOB buffer.
                      byte[] outbyte = new byte[bufferSize];  // The BLOB byte[] buffer to be filled by GetBytes.
                      long retval;                            // The bytes returned from GetBytes.
                      long startIndex = 0;                    // The starting position in the BLOB output.

                      string pub_id = "";                     // The publisher id to use in the file name.

                      // Create a file to hold the output.
                      string server = HttpContext.Current.Server.MapPath("~/");
                      string[] f = reader.GetString(1).Split('\\');
                      fileName = f[f.Length - 1];
                      fs = new FileStream(server + @"\attachements\" + fileName, FileMode.OpenOrCreate, FileAccess.Write);
                      bw = new BinaryWriter(fs);

                      // Reset the starting byte for the new BLOB.
                      startIndex = 0;

                      // Read the bytes into outbyte[] and retain the number of bytes returned.
                      retval = reader.GetBytes(0, startIndex, outbyte, 0, bufferSize);

                      // Continue reading and writing while there are bytes beyond the size of the buffer.
                      while (retval == bufferSize)
                      {
                          bw.Write(outbyte);
                          bw.Flush();

                          // Reposition the start index to the end of the last buffer and fill the buffer.
                          startIndex += bufferSize;
                          retval = reader.GetBytes(0, startIndex, outbyte, 0, bufferSize);
                      }

                      // Write the remaining buffer.
                      bw.Write(outbyte, 0, (int)retval - 1);
                      bw.Flush();

                      // Close the output file.
                      bw.Close();
                      fs.Close();
                
                }
                return fileName;
            }
            catch (Exception ex)
            {
                throw ex;

            }
            finally
            {
                if (cn.State.Equals(System.Data.ConnectionState.Open)) { cn.Close(); }
            }
            return "";
        }

        [WebMethod(Description = "get experiment's Attachements ")]
        public string GetAttachements(string notebook, string page)
        {
            OracleConnection cn = new OracleConnection();
            if (cn.State != ConnectionState.Open)
            {
                cn.ConnectionString = conn;
                cn.Open();
            }

            OracleCommand command = new OracleCommand();
            command.Connection = cn;

            try
            {
                string sql = "select  ATTACHEMENT_KEY, PAGE_KEY, DOCUMENT_NAME, DOCUMENT_DESCRIPTION, ORIGINAL_FILE_NAME from CEN_ATTACHEMENTS where page_key = (select page_key from cen_pages where notebook ='" + notebook + "' and experiment  ='" + page + "')";

//                string sql = "select * from batch_lev3_vw where notebook ='" + notebook + "' and experiment  = '" + page + "' and batch_type in ('SOLVENT' , 'REAGENT', 'REACTANT') and SYNTH_ROUTE_REF is null";

                OracleCommand oraCommand = new OracleCommand(sql, command.Connection);
                OracleDataReader reader = oraCommand.ExecuteReader();
                DataTable dt = new DataTable();
                dt.Load(reader);

                if (dt.Rows.Count > 0)
                {
                    string js = "";
                    js = Utility.GetJson(dt);
                    return js;
                }
                else
                {
                    return "";
                }

            }
            catch (Exception ex)
            {
                throw ex;

            }
            finally
            {
                if (cn.State.Equals(System.Data.ConnectionState.Open)) { cn.Close(); }
            }
            return "";
        }

        [WebMethod(Description = "get batch")]
        public string GetBatch(string batch, string format, string type)
        {

            OracleConnection cn = new OracleConnection();
            if (cn.State != ConnectionState.Open)
            {
                cn.ConnectionString = conn  ;
                cn.Open();
            }

            OracleCommand command = new OracleCommand();
            command.Connection = cn;
            command.BindByName = true;
            command.CommandText = "CEN_DEV_OWNER.match.get_batch";

            OracleParameter vBatch = new OracleParameter("vBatch", OracleDbType.Varchar2);
            vBatch.Direction = ParameterDirection.Input;
            vBatch.Value = batch;

            OracleParameter vType = new OracleParameter("vType", OracleDbType.Varchar2);
            vType.Direction = ParameterDirection.Input;
            vType.Value = type;

            command.CommandType = CommandType.StoredProcedure;
            OracleParameter compound = new OracleParameter("compound", OracleDbType.Clob);
            compound.Direction = ParameterDirection.Output;

            OracleParameter mw = new OracleParameter("mw", OracleDbType.Varchar2);
            mw.Size = 100;
            mw.Direction = ParameterDirection.Output;

            OracleParameter mf = new OracleParameter("mf", OracleDbType.Varchar2);
            mf.Size = 100;
            mf.Direction = ParameterDirection.Output;


            command.Parameters.Add(vBatch);
            command.Parameters.Add(vType);
            command.Parameters.Add(compound);
            command.Parameters.Add(mw);
            command.Parameters.Add(mf);

            DataSet tmprd = new DataSet("Structure");
            try
            {

                command.ExecuteNonQuery();
                Oracle.DataAccess.Types.OracleClob cl = (Oracle.DataAccess.Types.OracleClob)compound.Value;
                string cls = "";
                if (format=="json")
                {
                    cls = cl.Value.ToString().Replace("\r", "\\r").Replace("\n", "\\n").Replace("\\r", "");
                    
                }
                else
                {
                    cls = cl.Value.ToString();
                }
                string tmp = "{\"mw\":\"" + mw.Value + "\", \"mf\":\"" + mf.Value + "\", \"compound\":\"" + cls + "\"}";
                return tmp;
            }
            catch (Exception ex)
            {
                throw ex;

            }
            finally
            {
                if (cn.State.Equals(System.Data.ConnectionState.Open)) { cn.Close(); }
            }
        }

        [WebMethod(Description = "get bottle")]
        public string GetBottle(string id, string format, string type)
        {

            OracleConnection cn = new OracleConnection();
            if (cn.State != ConnectionState.Open)
            {
                cn.ConnectionString = conn;
                cn.Open();
            }

            OracleCommand command = new OracleCommand();
            command.Connection = cn;
            command.BindByName = true;
            command.CommandText = "CEN_DEV_OWNER.match.get_bottle";

            OracleParameter vBatch = new OracleParameter("vId", OracleDbType.Varchar2);
            vBatch.Direction = ParameterDirection.Input;
            vBatch.Value = id;

            OracleParameter vType = new OracleParameter("vType", OracleDbType.Varchar2);
            vType.Direction = ParameterDirection.Input;
            vType.Value = type;

            command.CommandType = CommandType.StoredProcedure;
            OracleParameter compound = new OracleParameter("compound", OracleDbType.Clob);
            compound.Direction = ParameterDirection.Output;

            OracleParameter mw = new OracleParameter("mw", OracleDbType.Varchar2);
            mw.Size = 100;
            mw.Direction = ParameterDirection.Output;

            OracleParameter mf = new OracleParameter("mf", OracleDbType.Varchar2);
            mf.Size = 100;
            mf.Direction = ParameterDirection.Output;

            command.Parameters.Add(vBatch);
            command.Parameters.Add(vType);
            command.Parameters.Add(compound);
            command.Parameters.Add(mw);
            command.Parameters.Add(mf);

            DataSet tmprd = new DataSet("Structure");
            try
            {

                command.ExecuteNonQuery();
                Oracle.DataAccess.Types.OracleClob cl = (Oracle.DataAccess.Types.OracleClob)compound.Value;
                string cls = "";
                if (format == "json")
                {
                    cls = cl.Value.ToString().Replace("\r", "\\r").Replace("\n", "\\n").Replace("\\r", "\\n");

                }
                else
                {
                    cls = cl.Value.ToString();
                }
                string tmp = "{\"mw\":\"" + mw.Value + "\", \"mf\":\"" + mf.Value + "\", \"compound\":\"" + cls + "\"}";
                return tmp;
            }
            catch (Exception ex)
            {
                throw ex;

            }
            finally
            {
                if (cn.State.Equals(System.Data.ConnectionState.Open)) { cn.Close(); }
            }
        }

        [WebMethod(Description = "search bottleform")]
        public string GetBottleForm(string strId, string type)
        {


            OracleConnection cn = new OracleConnection();
            if (cn.State != ConnectionState.Open)
            {
                cn.ConnectionString = conn;
                cn.Open();
            }

            OracleCommand command = new OracleCommand();
            command.Connection = cn;
            command.BindByName = true;
            command.CommandText = "CEN_DEV_OWNER.match.get_bottle_form";

            command.CommandType = CommandType.StoredProcedure;
            OracleParameter ret = new OracleParameter("ret", OracleDbType.RefCursor);
            ret.Direction = ParameterDirection.Output;

            OracleParameter id = new OracleParameter("vId", OracleDbType.Varchar2);
            id.Direction = ParameterDirection.Input;
            id.Value = strId;

            OracleParameter vType = new OracleParameter("vType", OracleDbType.Varchar2);
            vType.Direction = ParameterDirection.Input;
            vType.Value = type;

            command.Parameters.Add(id);
            command.Parameters.Add(vType);
            command.Parameters.Add(ret);

            DataSet tmprd = new DataSet("Formulation");
            try
            {
                command.ExecuteNonQuery();
                OracleDataAdapter da = new OracleDataAdapter();
                da.SelectCommand = command;
                da.Fill(tmprd);
                string js = Utility.GetJson(tmprd.Tables[0]);
                return js;
            }
            catch (Exception ex)
            {
                throw ex;

            }
            finally
            {
                if (cn.State.Equals(System.Data.ConnectionState.Open)) { cn.Close(); }
            }
            return "";
        }
        
        [WebMethod(Description = "get bottles formulationdata")]
        public string GetNextPage(string notebook, string username)
        {
            OracleConnection cn = new OracleConnection();
            if (cn.State != ConnectionState.Open)
            {
                cn.ConnectionString = conn;
                cn.Open();
            }

            try
            {
                OracleCommand command0 = new OracleCommand("select distinct(username) from cen_pages where notebook = '" + notebook + "'");
                command0.Connection = cn;
                OracleDataReader reader0 = command0.ExecuteReader();
                DataTable dt0 = new DataTable();
                dt0.Load(reader0);
                if (dt0.Rows.Count > 0)
                {
                    if (dt0.Rows[0].ItemArray[0].ToString() != username.ToUpper())
                    {
                        return "-1";
                    }
                }
                else
                {
                    return "1"; //quaderno nuovo
                }
                OracleCommand command = new OracleCommand("select max(experiment) + 1 maxexp from cen_pages where username = '" + username.ToUpper() + "' and notebook = '" + notebook + "'");
                //OracleParameter userP = new OracleParameter("user", OracleDbType.Varchar2);
                //userP.Direction = ParameterDirection.Input;
                //userP.Value = username;

                //OracleParameter nbP = new OracleParameter("nb", OracleDbType.Varchar2);
                //nbP.Direction = ParameterDirection.Input;
                //nbP.Value = notebook;

                //command.BindByName=true;
                //command.Parameters.Add(userP);
                //command.Parameters.Add(nbP);
                command.Connection = cn;

                OracleDataReader reader = command.ExecuteReader();
                DataTable dt = new DataTable();
                dt.Load(reader);

                if (dt.Rows.Count > 0)
                {
                    string js = "";
                    js = Utility.GetJson(dt);
                    return js;
                }
                else
                {
                    return "";
                }

            }
            catch (Exception ex)
            {
                throw ex;

            }
            finally
            {
                if (cn.State.Equals(System.Data.ConnectionState.Open)) { cn.Close(); }
            }
            return "";
        }

        [WebMethod(Description = "get pages notebook")]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)] 
        public string GetPagesNotebook(string cns, string notebook)
        {
            if (cns == "")
            {
                cns = conn;
            }
            OracleConnection cn = new OracleConnection();
            if (cn.State != ConnectionState.Open)
            {
                cn.ConnectionString = cns;
                cn.Open();
            }

            OracleCommand command = new OracleCommand();
            command.Connection = cn;

            try
            {
                OracleCommand oraCommand = new OracleCommand("select distinct experiment  from CEN_PAGES where notebook ='" + notebook + "' order by experiment", command.Connection);
                OracleDataReader reader = oraCommand.ExecuteReader();
                DataTable dt = new DataTable();
                dt.Load(reader);
                string js = "";
                if (dt.Rows.Count > 0)
                {
                    js = "[";
                    foreach (DataRow item in dt.Rows)
                    {
                        js = js + "{'title': '" + item.ItemArray[0] + "', 'isLazy': false },";
                    }
                    return js.TrimEnd(',') + "]";

                }
                else
                {
                    return "";
                }

            }
            catch (Exception ex)
            {
                throw ex;

            }
            finally
            {
                if (cn.State.Equals(System.Data.ConnectionState.Open)) { cn.Close(); }
            }
            return "";
        }

        [WebMethod(Description = "get Experiment")]
        public string GetCurrentUser()
        {
            return Environment.UserName + " 2:" + User.Identity.Name;
        }

        [WebMethod(Description = "get Experiment")]
        public string GetExperiment(string notebook, string page, string enumVal)
        {
            OracleConnection cn = new OracleConnection();
            if (cn.State != ConnectionState.Open)
            {
                cn.ConnectionString = conn;
                cn.Open();
            }

            OracleCommand command = new OracleCommand();
            command.Connection = cn;

            try
            {
                string sql="";
                if (enumVal=="undefined")
                {
                    sql="select * from pages_vw where notebook ='" + notebook + "' and experiment  = '" + page + "' and SYNTH_ROUTE_REF is null";                    
                }
                else
                {
                    sql = "select * from pages_vw where notebook ='" + notebook + "' and experiment  = '" + page + "' and SYNTH_ROUTE_REF =" + enumVal;
                }
                OracleCommand oraCommand = new OracleCommand(sql, command.Connection);
                OracleDataReader reader = oraCommand.ExecuteReader();
                DataTable dt = new DataTable();
                dt.Load(reader);

                if (dt.Rows.Count > 0)
                {
                    string js = "";
                    js = Utility.GetJson(dt);
                    return js;
                }
                else
                {
                    return "";
                }

            }
            catch (Exception ex)
            {
                throw ex;

            }
            finally
            {
                if (cn.State.Equals(System.Data.ConnectionState.Open)) { cn.Close(); }
            }
            return "";
        }

        [WebMethod(Description = "get bottles formulationdata")]
        public string GetFormulationData(Int32 strId)
        {
            OracleConnection cn = new OracleConnection();
            if (cn.State != ConnectionState.Open)
            {
                cn.ConnectionString = "Data Source=nmsdd;Persist Security Info=True;User ID=mar;Password=nervi"; ;
                cn.Open();
            }
           
            try
            {
                OracleCommand command = new OracleCommand("select FORMULATION_ID, BOTTLE_ID, RISK_CODES, RISK_SYMBOLS, SAFETY_CODES, DENSITY, PURITY,CURRENT_owner, STORAGE_LOCATION, STORAGE_SUBLOCATION, FORMULATION_NAME, LAST_WEIGH, UNIT from bottles.BOT_BOTTLES_STRUC_V where FORMULATION_ID = :strid");
                OracleParameter molecule = new OracleParameter("strid", OracleDbType.Int32);
                molecule.Direction = ParameterDirection.Input;
                molecule.Value = strId;

                command.Parameters.Add(molecule);
                command.Connection = cn;

                OracleDataReader reader = command.ExecuteReader();
                DataTable dt = new DataTable();
                dt.Load(reader);

                if (dt.Rows.Count > 0)
                {
                    string js = "";
                    js = Utility.GetJson(dt);
                    return js;
                }
                else
                {
                    return "";
                }

            }
            catch (Exception ex)
            {
                throw ex;

            }
            finally
            {
                if (cn.State.Equals(System.Data.ConnectionState.Open)) { cn.Close(); }
            }
            return "";
        }

        [WebMethod(Description = "Convert sdf into images json format")]
        public string GetImageFromSdf(string sdf)
        {
            string fn = HttpContext.Current.Server.MapPath(".") + "\\" + System.IO.Path.GetRandomFileName();
            //return fn;
            System.IO.File.WriteAllText(fn, sdf);

            Indigo indigo = new Indigo();

            string ret = "";

            //foreach (IndigoObject item in indigo.iterateSDFile("structures.sdf"))
            //    if (item.hasProperty("cdbregno"))
            //        System.Console.WriteLine(item.getProperty("cdbregno"));

            foreach (IndigoObject structure in indigo.iterateSDFile(fn))
            {
                IndigoRenderer indigoRenderer = new IndigoRenderer(indigo);
                //IndigoObject m = indigo.loadReaction(rxn);
                indigo.setOption("render-coloring", "true");
                Bitmap image = indigoRenderer.renderToBitmap(structure);
                string img;
                using (MemoryStream ms = new MemoryStream())
                {
                    // Convert Image to byte[]
                    image.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
                    byte[] imageBytes = ms.ToArray();

                    // Convert byte[] to Base64 String
                    string base64String = Convert.ToBase64String(imageBytes);
                    img = base64String;
                }

                Dictionary<string, string> reag = new Dictionary<string, string>();


                reag.Add("MOL", img);

                JavaScriptSerializer js = new JavaScriptSerializer();
                string json = js.Serialize(reag);

                ret = ret + json + ",";

            }
            indigo.Dispose();
            ret = ret.TrimEnd(',');
            
            File.Delete(fn);
            return "[" + ret + "]";

        }

        [WebMethod(Description = "Get active projects")]
        public string getProjects()
        {
            string SQL
                = "SELECT    DISTINCT project AS name  " +
                    "  FROM    projects  " +
                    " WHERE    flag = 'y' OR flag = 'B' AND project NOT LIKE '%D000018'   " +
                    "UNION  " +
                    "SELECT    DISTINCT 'ACTR' || CHR (38) || 'D000018.' || name as name " +
                    "  FROM    biodb.princ  " +
                    " WHERE    reg_chemtools = 'Y'   " +
                    "union   " +
                    "SELECT 'ACTR' || CHR (38) || 'D000004.NMR' as name from dual " +
                    "union   " +
                    "SELECT 'ROLIDH1.FBA' as name from dual " +
                    "union   " +
                    "SELECT 'NMSSYK.FBA' as name from dual " +
                    "union   " +
                    "SELECT 'Sample Handling' as name from dual " +
                    "ORDER BY   name  ";

            OracleConnection cn = new OracleConnection();
            if (cn.State != ConnectionState.Open)
            {
                cn.ConnectionString = "Data Source=nmsdd;Persist Security Info=True;User ID=mar;Password=nervi"; ;
                cn.Open();
            }

            OracleCommand command = new OracleCommand(SQL, cn);
            OracleDataAdapter da = new OracleDataAdapter();
            try
            {
                DataSet tmprd = new DataSet("Projects");
                da.SelectCommand = command;
                da.Fill(tmprd);

                string js = "";
                js = Utility.GetJson(tmprd.Tables[0]);
                return js;

            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (cn.State.Equals(System.Data.ConnectionState.Open)) { cn.Close(); }
            }

        }
        [WebMethod(Description = "get products")]
        public string GetProducts(string notebook, string page, string enumVal)
        {
            OracleConnection cn = new OracleConnection();
            if (cn.State != ConnectionState.Open)
            {
                cn.ConnectionString = conn;
                cn.Open();
            }

            OracleCommand command = new OracleCommand();
            command.Connection = cn;

            try
            {
                string sql="";
                if (enumVal == "undefined")
                {
                    sql = "select * from batch_lev3_vw where notebook ='" + notebook + "' and experiment  = '" + page + "' and batch_type in (  'PRODUCT' ,'INTENDED' , 'ACTUAL') and SYNTH_ROUTE_REF is null";
                }
                else
                {
                    sql = "select * from batch_vw where notebook ='" + notebook + "' and experiment  = '" + page + "' and batch_type in (  'PRODUCT' ,'INTENDED' , 'ACTUAL') and SYNTH_ROUTE_REF =" + enumVal;
                }


                OracleCommand oraCommand = new OracleCommand(sql, command.Connection);
                OracleDataReader reader = oraCommand.ExecuteReader();
                DataTable dt = new DataTable();
                dt.Load(reader);

                if (dt.Rows.Count > 0)
                {
                    string js = "";
                    js = Utility.GetJson(dt);
                    return js;
                }
                else
                {
                    return "";
                }

            }
            catch (Exception ex)
            {
                throw ex;

            }
            finally
            {
                if (cn.State.Equals(System.Data.ConnectionState.Open)) { cn.Close(); }
            }
            return "";
        }

        [WebMethod(Description = "get products access indigo")]
        public string GetProductsIndigo(string rxn)
        {
            com.ggasoftware.indigo.Indigo indigo = new Indigo();
            IndigoRenderer indigoRenderer = new IndigoRenderer(indigo);
            IndigoObject m = indigo.loadReaction(rxn);

            string ret = "";


            int count = 0;
            foreach (IndigoObject item in m.iterateProducts())
            {
                count++;
                Dictionary<string, string> reag = new Dictionary<string, string>();
                reag.Add("id", count.ToString());
                reag.Add("NOTEBOOK", "");
                reag.Add("EXPERIMENT", "");
                reag.Add("CHEMICAL_NAME", "Product" + count.ToString());
                reag.Add("BATCH_MW_VALUE", item.molecularWeight().ToString().Replace(',', '.'));
                reag.Add("MOLECULAR_FORMULA", item.grossFormula());
                reag.Add("BATCH_TYPE", "PRODUCT");
                reag.Add("MOLE_VALUE", "");
                reag.Add("MOLE_UNIT_CODE", "");
                reag.Add("PURITY_VALUE", "");
                reag.Add("PURITY_UNIT_CODE", "");
                reag.Add("VOLUME_VALUE", "");
                reag.Add("VOLUME_UNIT_CODE", "");
                reag.Add("MOLARITY_VALUE", "");
                reag.Add("MOLARITY_UNIT_CODE", "");
                reag.Add("DENSITY_VALUE", "");
                reag.Add("DENSITY_UNIT_CODE", "");
                reag.Add("WEIGHT_VALUE", "");
                reag.Add("WEIGHT_UNIT_CODE", "");
                reag.Add("CAS_NUMBER", "");
                reag.Add("USER_HAZARD_COMMENTS", "");
                reag.Add("COMPOUND", item.molfile());

                JavaScriptSerializer js = new JavaScriptSerializer();
                string json = js.Serialize(reag);

                ret = ret + json + ",";
            }

            ret = ret.TrimEnd(',');

            return "[" + ret + "]";
        }

        [WebMethod(Description = "get reagents")]
        public string GetReagents(string notebook, string page, string enumVal)
        {
            OracleConnection cn = new OracleConnection();
            if (cn.State != ConnectionState.Open)
            {
                cn.ConnectionString = conn;
                cn.Open();
            }

            OracleCommand command = new OracleCommand();
            command.Connection = cn;

            try
            {
                string sql = "";
                if (enumVal == "undefined")
                {
                    sql = "select * from batch_lev3_vw where notebook ='" + notebook + "' and experiment  = '" + page + "' and batch_type in ('SOLVENT' , 'REAGENT', 'REACTANT') and SYNTH_ROUTE_REF is null";
                }
                else
                {
                    sql = "select * from batch_vw where notebook ='" + notebook + "' and experiment  = '" + page + "' and batch_type in ('SOLVENT' , 'REAGENT', 'REACTANT') and SYNTH_ROUTE_REF =" + enumVal;
                }

                OracleCommand oraCommand = new OracleCommand(sql, command.Connection);
                OracleDataReader reader = oraCommand.ExecuteReader();
                DataTable dt = new DataTable();
                dt.Load(reader);

                if (dt.Rows.Count > 0)
                {
                    string js = "";
                    js = Utility.GetJson(dt);
                    return js;
                }
                else
                {
                    return "";
                }

            }
            catch (Exception ex)
            {
                throw ex;

            }
            finally
            {
                if (cn.State.Equals(System.Data.ConnectionState.Open)) { cn.Close(); }
            }
            return "";
        }

        [WebMethod(Description = "get reaction id from notebook and page")]
        public string GetRXNidFromExperiment(string notebook, string page)
        {
            OracleConnection cn = new OracleConnection();
            if (cn.State != ConnectionState.Open)
            {
                cn.ConnectionString = conn;
                cn.Open();
            }

            OracleCommand command = new OracleCommand();
            command.Connection = cn;

            try
            {
                OracleCommand oraCommand = new OracleCommand("select RXN_SCHEME_KEY from CEN_REACTION_SCHEMES where reaction_type = 'INTENDED' and page_key =" +
                    "(select page_key from CEN_PAGES where notebook ='" + notebook + "' and experiment  = '" + page + "')", command.Connection);
                OracleDataReader reader = oraCommand.ExecuteReader();
                DataTable dt = new DataTable();
                dt.Load(reader);

                if (dt.Rows.Count > 0)
                {
                    string js = "";
                    js = Utility.GetJson(dt);
                    return js;
                }
                else
                {
                    return "";
                }

            }
            catch (Exception ex)
            {
                throw ex;

            }
            finally
            {
                if (cn.State.Equals(System.Data.ConnectionState.Open)) { cn.Close(); }
            }
            return "";
        }

        [WebMethod(Description = "get reaction")]
        public string GetReaction(string reactionId, string cns, string outType)
        {
            if (outType == "")
            {
                outType = "json";
            }
            if (cns == "")
            {
                cns = conn;
            }
            OracleConnection cn = new OracleConnection();
            if (cn.State != ConnectionState.Open)
            {
                cn.ConnectionString = cns;
                cn.Open();
            }

            OracleCommand command = new OracleCommand();
            command.Connection = cn;

            if (reactionId == "")
            {
                reactionId = "99fb84942ace51d341c9cf4b51487a99919c695e";
            }

            try
            {
                OracleCommand oraCommand = new OracleCommand("SELECT Bingo.rxnfile(r.native_rxn_sketch) as reaction " +
                    "FROM cen_reaction_schemes r WHERE DBMS_LOB.getlength (r.native_rxn_sketch) > 0 " +
                    "AND RXN_SCHEME_KEY = '" + reactionId + "'", command.Connection);
                OracleDataReader reader = oraCommand.ExecuteReader();
                DataTable dt = new DataTable();
                dt.Load(reader);

                if (dt.Rows.Count > 0)
                {
                    string js = "";
                    if (outType == "json")
                    {
                        js = Utility.GetJson(dt);
                    }
                    else if (outType == "txt")
                    {
                        js = dt.Rows[0].ItemArray[0].ToString();
                    }
                    return js;
                }
                else
                {
                    return "";
                }

            }
            catch (Exception ex)
            {
                throw ex;

            }
            finally
            {
                if (cn.State.Equals(System.Data.ConnectionState.Open)) { cn.Close(); }
            }
            return "";
        }

        [WebMethod(Description = "get reaction enumerated")]
        public string CheckReactionsEnumerated(string notebook, string page)
        {
            OracleConnection cn = new OracleConnection();
            if (cn.State != ConnectionState.Open)
            {
                cn.ConnectionString = conn;
                cn.Open();
            }

            OracleCommand command = new OracleCommand();
            command.Connection = cn;
            try
            {
                string SQL
                    = "SELECT count(*) FROM cen_reaction_schemes r  " +
                        "    WHERE reaction_type = 'ENUMERATED' and DBMS_LOB.getlength (r.native_rxn_sketch) > 0  " +
                        "    and page_key = (select page_key from CEN_PAGES where notebook ='" + notebook + "'  and experiment  = '" + page + "') ";

                OracleCommand oraCommand = new OracleCommand(SQL, command.Connection);

                OracleDataReader reader = oraCommand.ExecuteReader();
                DataTable dt = new DataTable();
                dt.Load(reader);
                string ret = "";
                if (dt.Rows.Count > 0)
                { 
                    return dt.Rows[0].ItemArray[0].ToString();
                }

                return "";
            }
            catch (Exception ex)
            {
                throw ex;

            }
            finally
            {
                if (cn.State.Equals(System.Data.ConnectionState.Open)) { cn.Close(); }
            }
        }

        [WebMethod(Description = "get reaction enumerated")]
        public string GetReactionsEnumerated(string notebook, string page)
        {
            
            OracleConnection cn = new OracleConnection();
            if (cn.State != ConnectionState.Open)
            {
                cn.ConnectionString = conn;
                cn.Open();
            }

            OracleCommand command = new OracleCommand();
            command.Connection = cn;            
            try
            {
                string SQL
                    = "SELECT Bingo.rxnfile(r.native_rxn_sketch) as reaction, SYNTH_ROUTE_REF FROM cen_reaction_schemes r  " +
                        "    WHERE reaction_type = 'ENUMERATED' and DBMS_LOB.getlength (r.native_rxn_sketch) > 0  " +
                        "    and page_key = (select page_key from CEN_PAGES where notebook ='" + notebook + "'  and experiment  = '" + page + "') ";

                OracleCommand oraCommand = new OracleCommand(SQL, command.Connection);
               
                OracleDataReader reader = oraCommand.ExecuteReader();
                DataTable dt = new DataTable();
                dt.Load(reader);
                string ret = "";
                if (dt.Rows.Count > 0)
                {
                    Indigo indigo = new Indigo();
                    IndigoRenderer indigoRenderer = new IndigoRenderer(indigo);
                    indigo.setOption("render-grid-title-property", "Enumeration");
                    indigo.setOption("render-coloring", "true");

                    foreach (DataRow row in dt.Rows)
                    {
                        Dictionary<string, string>[] reag = new Dictionary<string, string>[] 
                        {
                            new Dictionary<string, string>(),
                            new Dictionary<string, string>(),
                            new Dictionary<string, string>()
                        };

                        IndigoObject m = indigo.loadReaction(row.ItemArray[0].ToString());
                        Bitmap image = indigoRenderer.renderToBitmap(m);
                        using (MemoryStream ms = new MemoryStream())
                        {
                            // Convert Image to byte[]
                            image.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
                            byte[] imageBytes = ms.ToArray();

                            // Convert byte[] to Base64 String
                            string base64String = Convert.ToBase64String(imageBytes);
                            //return base64String;

                            //ret = ret + "{'Image':'aaa', 'RXN':'bbb'},";
                            //ret = ret + "{'Image':'" + base64String + "', 'RXN':'" + row.ItemArray[0].ToString() + "'},";

                            reag[0].Add("Image", base64String);
                            reag[1].Add("RXN", row.ItemArray[0].ToString());
                            reag[2].Add("EnumNumber", row.ItemArray[1].ToString());
                            //reag.Add("RXN", "pippo");
                            JavaScriptSerializer js = new JavaScriptSerializer();
                            string json = js.Serialize(reag);
                            ret = ret + json + ",";
                        }
                    }
                    indigo.Dispose();

                    ret = ret.TrimEnd(',');
                    return "[" + ret + "]";
                }
                else
                {
                    return "";
                }

            }
            catch (Exception ex)
            {
                throw ex;

            }
            finally
            {
                if (cn.State.Equals(System.Data.ConnectionState.Open)) { cn.Close(); }
            }
            return "";
        }

        [WebMethod(Description = "get reaction enumerated")]
        public string GetReactionsEnumeratedNumbers(string notebook, string page)
        {

            OracleConnection cn = new OracleConnection();
            if (cn.State != ConnectionState.Open)
            {
                cn.ConnectionString = conn;
                cn.Open();
            }

            OracleCommand command = new OracleCommand();
            command.Connection = cn;
            try
            {
                string SQL
                    = "SELECT SYNTH_ROUTE_REF FROM cen_reaction_schemes r  " +
                        "    WHERE reaction_type = 'ENUMERATED' and DBMS_LOB.getlength (r.native_rxn_sketch) > 0  " +
                        "    and page_key = (select page_key from CEN_PAGES where notebook ='" + notebook + "'  and experiment  = '" + page + "') ";

                OracleCommand oraCommand = new OracleCommand(SQL, command.Connection);

                OracleDataReader reader = oraCommand.ExecuteReader();
                DataTable dt = new DataTable();
                dt.Load(reader);
                string ret = "";
                if (dt.Rows.Count > 0)
                {
                    foreach (DataRow row in dt.Rows)
                    {
                        Dictionary<string, string>[] reag = new Dictionary<string, string>[] 
                        {
                            new Dictionary<string, string>()
                        };

                        reag[0].Add("EnumNumber", row.ItemArray[0].ToString());
                        JavaScriptSerializer js = new JavaScriptSerializer();
                        string json = js.Serialize(reag);
                        ret = ret + json + ",";
                    }

                    ret = ret.TrimEnd(',');
                    return "[" + ret + "]";
                }
                else
                {
                    return "";
                }

            }
            catch (Exception ex)
            {
                throw ex;

            }
            finally
            {
                if (cn.State.Equals(System.Data.ConnectionState.Open)) { cn.Close(); }
            }
            return "";
        }
        
        [WebMethod(Description = "get image base64String from rxn")]
        public string GetReactionImage(string rxn)
        {
            com.ggasoftware.indigo.Indigo indigo = new Indigo();

            IndigoRenderer indigoRenderer = new IndigoRenderer(indigo);
            IndigoObject m = indigo.loadReaction(rxn);
            string ret = "";
            Bitmap image = indigoRenderer.renderToBitmap(m);
            using (MemoryStream ms = new MemoryStream())
            {
                // Convert Image to byte[]
                image.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
                byte[] imageBytes = ms.ToArray();

                // Convert byte[] to Base64 String
                string base64String = Convert.ToBase64String(imageBytes);
                ret = base64String;
            }

            return ret;
        }

        [WebMethod(Description = "get reagents access indigo")]
        public string GetReagentsIndigo(string rxn)
        {
            com.ggasoftware.indigo.Indigo indigo = new Indigo();
            IndigoRenderer indigoRenderer = new IndigoRenderer(indigo);
            IndigoObject m = indigo.loadReaction(rxn);

            string ret = "";


            int count = 0;
            foreach (IndigoObject item in m.iterateReactants())
            {
                count++;
                Dictionary<string, string> reag = new Dictionary<string, string>();

                reag.Add("id", count.ToString());
                reag.Add("NOTEBOOK", "");
                reag.Add("EXPERIMENT", "");
                reag.Add("CHEMICAL_NAME", "Reactant" + count.ToString());
                reag.Add("BATCH_MW_VALUE", item.molecularWeight().ToString().Replace(',', '.'));
                reag.Add("MOLECULAR_FORMULA", item.grossFormula());
                reag.Add("BATCH_TYPE", "REAGENT");
                reag.Add("MOLE_VALUE", "");
                reag.Add("MOLE_UNIT_CODE", "");
                reag.Add("PURITY_VALUE", "");
                reag.Add("PURITY_UNIT_CODE", "");
                reag.Add("VOLUME_VALUE", "");
                reag.Add("VOLUME_UNIT_CODE", "");
                reag.Add("MOLARITY_VALUE", "");
                reag.Add("MOLARITY_UNIT_CODE", "");
                reag.Add("DENSITY_VALUE", "");
                reag.Add("DENSITY_UNIT_CODE", "");
                reag.Add("WEIGHT_VALUE", "");
                reag.Add("WEIGHT_UNIT_CODE", "");
                reag.Add("CAS_NUMBER", "");
                reag.Add("USER_HAZARD_COMMENTS", "");
                reag.Add("COMPOUND", item.molfile());

                JavaScriptSerializer js = new JavaScriptSerializer();
                string json = js.Serialize(reag);

                ret = ret + json + ",";
            }

            ret = ret.TrimEnd(',');

            return "[" + ret + "]";
        }

        [WebMethod(Description = "get reaction")]
        public string GetUsersFullname(string cns)
        {
            if (cns == "")
            {
                cns = conn;
            }
            OracleConnection cn = new OracleConnection();
            if (cn.State != ConnectionState.Open)
            {
                cn.ConnectionString = cns;
                cn.Open();
            }

            OracleCommand command = new OracleCommand();
            command.Connection = cn;

            try
            {
                OracleCommand oraCommand = new OracleCommand("select fullname from CEN_USERS where site_code = 'SITE1' order by username", command.Connection);
                OracleDataReader reader = oraCommand.ExecuteReader();
                DataTable dt = new DataTable();
                dt.Load(reader);
                string js = "";
                if (dt.Rows.Count > 0)
                {
                    js = "[";
                    foreach (DataRow item in dt.Rows)
                    {
                        js = js + "{'title': '" + item.ItemArray[0] + "', 'isLazy': true , 'icon': \"/js/vendor/jquery.dynatree/skin-custom/PersonIcon16.gif\"},";
                    }
                    return js.TrimEnd(',') + "]";

                    //string js = "";
                    //js = Utility.GetJson(dt);
                    //return js;
                }
                else
                {
                    return "";
                }

            }
            catch (Exception ex)
            {
                throw ex;

            }
            finally
            {
                if (cn.State.Equals(System.Data.ConnectionState.Open)) { cn.Close(); }
            }
            return "";
        }

        [WebMethod(Description = "get user notebooks")]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)] 
        public string GetUserNotebooks(string cns, string userFullname)
        {
            if (cns == "")
            {
                cns = conn;
            }
            OracleConnection cn = new OracleConnection();
            if (cn.State != ConnectionState.Open)
            {
                cn.ConnectionString = cns;
                cn.Open();
            }

            OracleCommand command = new OracleCommand();
            command.Connection = cn;

            try
            {
                OracleCommand oraCommand = new OracleCommand("select distinct notebook from CEN_PAGES where owner_username =(select username from CEN_USERS where fullname = '" + userFullname + "' and site_code = 'SITE1') order by notebook", command.Connection);
                OracleDataReader reader = oraCommand.ExecuteReader();
                DataTable dt = new DataTable();
                dt.Load(reader);
                string js = "";
                if (dt.Rows.Count > 0)
                {
                    //List<Dictionary<string, object>> rows = new List<Dictionary<string, object>>();
                    //Dictionary<string, object> row = null;

                    //foreach (DataRow dr in dt.Rows)
                    //{
                    //    row = new Dictionary<string, object>();

                    //    row.Add("title", dr.ItemArray[0]);
                    //    row.Add("isLazy", true);
                    //    rows.Add(row);
                    //}
                    //js = Utility.GetJson(rows);
                    //return js;

                    js = "[";
                    foreach (DataRow item in dt.Rows)
                    {
                        js = js + "{'title': '" + item.ItemArray[0] + "', 'isLazy': true },";
                    }
                    return js.TrimEnd(',') + "]";
                    
                }
                else
                {
                    return "";
                }

            }
            catch (Exception ex)
            {
                throw ex;

            }
            finally
            {
                if (cn.State.Equals(System.Data.ConnectionState.Open)) { cn.Close(); }
            }
            return "";
        }

        [WebMethod(Description = "get reaction")]
        public string GetTest(string cns)
        {
            if (cns == "")
            {
                cns = conn;
            }
            OracleConnection cn = new OracleConnection();
            if (cn.State != ConnectionState.Open)
            {
                cn.ConnectionString = "Data Source=xe;Persist Security Info=True;User ID=easycertlist;Password=easycertlist"; ;
                cn.Open();
            }

            OracleCommand command = new OracleCommand();
            command.Connection = cn;

            try
            {
                OracleCommand oraCommand = new OracleCommand("select id_box, box_nome from box", command.Connection);
                OracleDataReader reader = oraCommand.ExecuteReader();
                DataTable dt = new DataTable();
                dt.Load(reader);

                if (dt.Rows.Count > 0)
                {
                    string js = "";
                    js = Utility.GetJson(dt);
                    return js;
                }
                else
                {
                    return "";
                }

            }
            catch (Exception ex)
            {
                throw ex;

            }
            finally
            {
                if (cn.State.Equals(System.Data.ConnectionState.Open)) { cn.Close(); }
            }
            return "";
        }

        [WebMethod(Description = "insert attachement")]
        public string InsertAttachement(string exper0, string nb0, string docDesc0, string docName0, string docOrFiNa0, byte[] attach0)
        {
            OracleConnection cn = new OracleConnection();
            if (cn.State != ConnectionState.Open)
            {
                cn.ConnectionString = conn;
                cn.Open();
            }

            OracleCommand command = new OracleCommand();
            command.Connection = cn;
            command.BindByName = true;
            command.CommandText = "CEN_DEV_OWNER.reg.insert_attachement";

            command.CommandType = CommandType.StoredProcedure;
            OracleParameter ret = new OracleParameter("ret", OracleDbType.Varchar2);
            ret.Size = 40;
            ret.Direction = ParameterDirection.Output;

            OracleParameter nb = new OracleParameter("nb", OracleDbType.Varchar2);
            nb.Direction = ParameterDirection.Input;
            nb.Value = nb0;

            OracleParameter exper = new OracleParameter("exper", OracleDbType.Varchar2);
            exper.Direction = ParameterDirection.Input;
            exper.Value = exper0;

            OracleParameter docDesc = new OracleParameter("docDesc", OracleDbType.Varchar2);
            docDesc.Direction = ParameterDirection.Input;
            docDesc.Value = docDesc0;

            OracleParameter docName = new OracleParameter("docName", OracleDbType.Varchar2);
            docName.Direction = ParameterDirection.Input;
            docName.Value = docName0;

            OracleParameter docOrFiNa = new OracleParameter("docOrFiNa", OracleDbType.Varchar2);
            docOrFiNa.Direction = ParameterDirection.Input;
            docOrFiNa.Value = docOrFiNa0;

            OracleParameter attach = new OracleParameter("attach", OracleDbType.Blob);
            attach.Direction = ParameterDirection.Input;
            attach.Value = attach0;

            command.Parameters.Add(nb);
            command.Parameters.Add(exper);
            command.Parameters.Add(docDesc);
            command.Parameters.Add(docName);
            command.Parameters.Add(docOrFiNa);
            command.Parameters.Add(attach);
            command.Parameters.Add(ret);

            DataSet tmprd = new DataSet("Structure");
            try
            {
                command.ExecuteNonQuery();
                return ret.Value.ToString();
            }
            catch (Exception ex)
            {
                throw ex;

            }
            finally
            {
                if (cn.State.Equals(System.Data.ConnectionState.Open)) { cn.Close(); }
            }
            return "";
        }

        [WebMethod(Description = "insert new experiment")]
        public string InsertDetail(string detail)
        {
            OracleConnection cn = new OracleConnection();
            if (cn.State != ConnectionState.Open)
            {
                cn.ConnectionString = conn;
                cn.Open();
            }

            OracleCommand command = new OracleCommand();
            command.Connection = cn;
            command.BindByName = true;
            command.CommandText = "CEN_DEV_OWNER.reg.insert_detail";

            command.CommandType = CommandType.StoredProcedure;
            OracleParameter ret = new OracleParameter("ret", OracleDbType.Int16);
            ret.Size = 500;
            ret.Direction = ParameterDirection.Output;

            OracleParameter detailO = new OracleParameter("detail", OracleDbType.Clob);
            detailO.Direction = ParameterDirection.Input;
            detailO.Value = detail;

            command.Parameters.Add(detailO);
            command.Parameters.Add(ret);

            DataSet tmprd = new DataSet("Structure");
            try
            {
                command.ExecuteNonQuery();
                return ret.Value.ToString();
            }
            catch (Exception ex)
            {
                throw ex;

            }
            finally
            {
                if (cn.State.Equals(System.Data.ConnectionState.Open)) { cn.Close(); }
            }
            return "";
        }

        [WebMethod(Description = "insert new experiment")]
        public string InsertExperiment(string rxn, string Reagents, string Products, string workup, string detail)
        {
            OracleConnection cn = new OracleConnection();
            if (cn.State != ConnectionState.Open)
            {
                cn.ConnectionString = conn;
                cn.Open();
            }

            OracleCommand command = new OracleCommand();
            command.Connection = cn;
            command.BindByName = true;
            command.CommandText = "CEN_DEV_OWNER.reg.insert_experiment";

            command.CommandType = CommandType.StoredProcedure;
            OracleParameter ret = new OracleParameter("ret", OracleDbType.Int16);
            ret.Size = 500;
            ret.Direction = ParameterDirection.Output;

            OracleParameter rxnO = new OracleParameter("struct", OracleDbType.Clob);
            rxnO.Direction = ParameterDirection.Input;
            rxnO.Value = rxn;

            OracleParameter ReagentsO = new OracleParameter("Reagents", OracleDbType.Varchar2);
            ReagentsO.Direction = ParameterDirection.Input;
            ReagentsO.Value = Reagents;

            OracleParameter ProductsO = new OracleParameter("Products", OracleDbType.Clob);
            ProductsO.Direction = ParameterDirection.Input;
            ProductsO.Value = Products;

            OracleParameter workupO = new OracleParameter("workup", OracleDbType.Clob);
            workupO.Direction = ParameterDirection.Input;
            workupO.Value = workup;

            OracleParameter detailO = new OracleParameter("detail", OracleDbType.Clob);
            detailO.Direction = ParameterDirection.Input;
            detailO.Value = detail;

            command.Parameters.Add(ReagentsO);
            command.Parameters.Add(ProductsO);
            command.Parameters.Add(workupO);
            command.Parameters.Add(rxnO);
            command.Parameters.Add(detailO);
            command.Parameters.Add(ret);

            DataSet tmprd = new DataSet("Structure");
            try
            {
                command.ExecuteNonQuery();
                return ret.Value.ToString();
            }
            catch (Exception ex)
            {
                throw ex;

            }
            finally
            {
                if (cn.State.Equals(System.Data.ConnectionState.Open)) { cn.Close(); }
            }
            return "";
        }

        [WebMethod(Description = "insert new experiment enumerated")]
        public string InsertExperimentEnum(string rxn, string structEnum, string detail)
        {
            //return "-111";
            OracleConnection cn = new OracleConnection();
            if (cn.State != ConnectionState.Open)
            {
                cn.ConnectionString = conn;
                cn.Open();
            }

            OracleCommand command = new OracleCommand();
            command.Connection = cn;
            command.BindByName = true;
            command.CommandText = "CEN_DEV_OWNER.reg.insert_experiment_enum";

            command.CommandType = CommandType.StoredProcedure;
            OracleParameter ret = new OracleParameter("ret", OracleDbType.Int16);
            ret.Size = 500;
            ret.Direction = ParameterDirection.Output;

            OracleParameter rxnO = new OracleParameter("struct", OracleDbType.Clob);
            rxnO.Direction = ParameterDirection.Input;
            rxnO.Value = rxn;

            OracleParameter StructEnum = new OracleParameter("structEnum", OracleDbType.Clob);
            StructEnum.Direction = ParameterDirection.Input;
            StructEnum.Value = structEnum;

            OracleParameter detailO = new OracleParameter("detail", OracleDbType.Clob);
            detailO.Direction = ParameterDirection.Input;
            detailO.Value = detail;

            command.Parameters.Add(StructEnum);
            command.Parameters.Add(rxnO);
            command.Parameters.Add(detailO);
            command.Parameters.Add(ret);

            DataSet tmprd = new DataSet("Structure");
            try
            {
                command.ExecuteNonQuery();
                return ret.Value.ToString();
            }
            catch (Exception ex)
            {
                throw ex;

            }
            finally
            {
                if (cn.State.Equals(System.Data.ConnectionState.Open)) { cn.Close(); }
            }
            return "";
        }

        [WebMethod(Description = "insert new experiment enum batches")]
        public string InsertExperimentEnumBatches(string Reagents, string Products, string detail)
        {
            //return "-111";
            OracleConnection cn = new OracleConnection();
            if (cn.State != ConnectionState.Open)
            {
                cn.ConnectionString = conn;
                cn.Open();
            }

            OracleCommand command = new OracleCommand();
            command.Connection = cn;
            command.BindByName = true;
            command.CommandText = "CEN_DEV_OWNER.reg.insert_experiment_enum_batches";

            command.CommandType = CommandType.StoredProcedure;
            OracleParameter ret = new OracleParameter("ret", OracleDbType.Int16);
            ret.Size = 500;
            ret.Direction = ParameterDirection.Output;

            OracleParameter ReagentsO = new OracleParameter("Reagents", OracleDbType.Varchar2);
            ReagentsO.Direction = ParameterDirection.Input;
            ReagentsO.Value = Reagents;

            OracleParameter ProductsO = new OracleParameter("Products", OracleDbType.Clob);
            ProductsO.Direction = ParameterDirection.Input;
            ProductsO.Value = Products;

            OracleParameter detailO = new OracleParameter("detail", OracleDbType.Clob);
            detailO.Direction = ParameterDirection.Input;
            detailO.Value = detail;

            command.Parameters.Add(ReagentsO);
            command.Parameters.Add(ProductsO);
            command.Parameters.Add(detailO);
            command.Parameters.Add(ret);

            DataSet tmprd = new DataSet("Structure");
            try
            {
                command.ExecuteNonQuery();
                return ret.Value.ToString();
            }
            catch (Exception ex)
            {
                throw ex;

            }
            finally
            {
                if (cn.State.Equals(System.Data.ConnectionState.Open)) { cn.Close(); }
            }
            return "";
        }

        public string insertBatches()
        {
            insertBatchAmount();
            return "";
        }

        public string insertBatchAmount()
        {
            return "";
        }

        public string insertPage(string detail)
        {
            return "";
        }

        public string insertStructures(string rxn)
        {
           
            return "";
        }

        [WebMethod(Description = "search bottles")]
        public string MatchBingoAllMol(string compound)
        {

            if (compound == "empty")
            {
                compound =
"\n" +
"-INDIGO-05211416322D\n" +
"\n" +
" 10 10  0  0  0  0  0  0  0  0999 V2000\n" +
"    0.0000    0.5000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
"    0.0000   -0.5000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
"    0.8660   -1.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
"    1.7321   -0.5000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
"    1.7321    0.5000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
"    0.8660    1.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
"    2.5981    1.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
"    3.4641    0.5000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
"    3.4641   -0.5000    0.0000 Cl  0  0  0  0  0  0  0  0  0  0  0  0\n" +
"    4.3301    1.0000    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n" +
"  2  3  1  0  0  0  0\n" +
"  4  5  1  0  0  0  0\n" +
"  1  2  2  0  0  0  0\n" +
"  5  7  1  0  0  0  0\n" +
"  5  6  2  0  0  0  0\n" +
"  7  8  1  0  0  0  0\n" +
"  6  1  1  0  0  0  0\n" +
"  8  9  1  0  0  0  0\n" +
"  3  4  2  0  0  0  0\n" +
"  8 10  2  0  0  0  0\n" +
"M  END";
            }

            OracleConnection cn = new OracleConnection();
            if (cn.State != ConnectionState.Open)
            {
                cn.ConnectionString = "Data Source=nmsdd;Persist Security Info=True;User ID=mar;Password=nervi"; ;
                cn.Open();
            }

            OracleCommand command = new OracleCommand();
            command.Connection = cn;
            command.BindByName = true;
            command.CommandType = CommandType.Text;

            string sql = "SELECT cmp_id as id,   'Chemtools' as Database,cl.batch as name, (select firstname ||  ' ' || lastname from mar_people_t where initials = cl.batch_resp) as  resp,  cl.submission_date as submission_date , '' as location, '' as formulation " +
                         " FROM    mar_corp_lot_t cl " +
                         " WHERE    cmp_id IN (SELECT   cmp_id " +
                         " FROM   mar_corp_str_assoc_t " +
                         " WHERE   str_id IN (SELECT     str_id " +
                         "                            FROM     mar_compound_bingo_t " +
                         "                           WHERE     bingo.exact (compound, " +
                         "                                     :struct        " +
                         "                                                      , 'ALL') = 1)) " +                                                  
                         " union " +
                         " SELECT     CM.STRUCTURE_ID, 'Bottles' as Database, STRUCTURE_NAME, '' as resp, sysdate as submission_date, DEFAULT_LOCATION_ID || '-' || DEFAULT_SUBLOCATION_ID as location, formulation_name as formulation " +
                         " FROM      bottles.BOT_STRUCTURES_BINGO_T cb ,bottles.bot_structures_t cm, bottles.BOT_FORMULATIONS_T cf " +
                         "     WHERE     CM.STRUCTURE_ID=CB.STRUCTURE_ID " +
                         "     and  Cf.STRUCTURE_ID=CB.STRUCTURE_ID " +
                         "     and bingo.exact (STRUCTURE_BINGO, " +
                         "              :struct " +
                         "                                , 'ALL') = 1";

            command.CommandText = sql;

            OracleParameter molecule = new OracleParameter("struct", OracleDbType.Clob);
            molecule.Direction = ParameterDirection.Input;
            molecule.Value = compound;

            command.Parameters.Add(molecule);

            DataSet tmprd = new DataSet("Structure");
            try
            {
                OracleDataReader reader = command.ExecuteReader();
                DataTable dt = new DataTable();
                dt.Load(reader);

                string js = Utility.GetJson(dt);
                return js;
            }
            catch (Exception ex)
            {
                throw ex;

            }
            finally
            {
                if (cn.State.Equals(System.Data.ConnectionState.Open)) { cn.Close(); }
            }
            return "";
        }

        [WebMethod(Description = "search bottles")]
        public string MatchBingoReactionD(string compound)
        {

            if (compound == "empty")
            {
                compound =
                    "\n" +
                    "  -ISIS-  03191415482D\n" +
                    "\n" +
                    "  6  6  0  0  0  0  0  0  0  0999 V2000\n" +
                    "    3.9694   -2.6875    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
                    "    3.9682   -3.5148    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
                    "    4.6831   -3.9277    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
                    "    5.3995   -3.5144    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
                    "    5.3966   -2.6838    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
                    "    4.6813   -2.2747    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
                    "  3  4  2  0  0  0  0\n" +
                    "  2  3  1  0  0  0  0\n" +
                    "  4  5  1  0  0  0  0\n" +
                    "  1  2  2  0  0  0  0\n" +
                    "  5  6  2  0  0  0  0\n" +
                    "  6  1  1  0  0  0  0\n" +
                    "M  END";
            }

            OracleConnection cn = new OracleConnection();
            if (cn.State != ConnectionState.Open)
            {
                cn.ConnectionString = "Data Source=eln;Persist Security Info=True;User ID=CEN_DEV_OWNER;Password=CEN_DEV_OWNER";
                cn.Open();
            }

            OracleCommand command = new OracleCommand();
            command.Connection = cn;
            command.BindByName = true;
            command.CommandType = CommandType.Text;

            string sql = "SELECT RXN_SCHEME_KEY as ID, " +
                        " 'Reaction' as Database, " +
                        "                    (SELECT subject " +
                        "                       FROM cen_pages " +
                        "                      WHERE page_key = r.page_key) " +
                        "                       AS subject, " +
                        "                    (SELECT fullname " +
                        "                       FROM cen_users " +
                        "                      WHERE username = (SELECT username " +
                        "                                          FROM cen_pages " +
                        "                                         WHERE page_key = r.page_key)) " +
                        "                       AS resp, " +
                        "                    (SELECT creation_date " +
                        "                       FROM cen_pages " +
                        "                      WHERE page_key = r.page_key) " +
                        "                       AS submission_date, " +
                        "                    (SELECT notebook " +
                        "                       FROM cen_pages " +
                        "                      WHERE page_key = r.page_key) " +
                        "                        || '-'  || " +
                        "                    (SELECT experiment " +
                        "                       FROM cen_pages " +
                        "                      WHERE page_key = r.page_key) " +
                        "                       AS name, " +
                        "                       '' as formulation " +
                        "               FROM cen_reaction_schemes r " +
                        "              WHERE DBMS_LOB.getlength (r.native_rxn_sketch) > 0 " +
                        "              AND bingo.Rexact (r.native_rxn_sketch, :struct, 'AAM') = 1";

            command.CommandText = sql;

            OracleParameter molecule = new OracleParameter("struct", OracleDbType.Clob);
            molecule.Direction = ParameterDirection.Input;
            molecule.Value = compound;

            command.Parameters.Add(molecule);

            DataSet tmprd = new DataSet("Structure");
            try
            {
                OracleDataReader reader = command.ExecuteReader();
                DataTable dt = new DataTable();
                dt.Load(reader);

                string js = Utility.GetJson(dt);
                return js;
            }
            catch (Exception ex)
            {
                throw ex;

            }
            finally
            {
                if (cn.State.Equals(System.Data.ConnectionState.Open)) { cn.Close(); }
            }
            return "";
        }

        [WebMethod(Description = "search bottles")]
        public string MatchBingoBottles(string compound, string cns)
        {

            if (compound == "empty")
            {
                compound =
                    "\n" +
                    "  -ISIS-  03191415482D\n" +
                    "\n" +
                    "  6  6  0  0  0  0  0  0  0  0999 V2000\n" +
                    "    3.9694   -2.6875    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
                    "    3.9682   -3.5148    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
                    "    4.6831   -3.9277    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
                    "    5.3995   -3.5144    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
                    "    5.3966   -2.6838    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
                    "    4.6813   -2.2747    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
                    "  3  4  2  0  0  0  0\n" +
                    "  2  3  1  0  0  0  0\n" +
                    "  4  5  1  0  0  0  0\n" +
                    "  1  2  2  0  0  0  0\n" +
                    "  5  6  2  0  0  0  0\n" +
                    "  6  1  1  0  0  0  0\n" +
                    "M  END";
            }

            if (cns == "")
            {
                cns = conn;
            }
            OracleConnection cn = new OracleConnection();
            if (cn.State != ConnectionState.Open)
            {
                cn.ConnectionString = "Data Source=nmsdd;Persist Security Info=True;User ID=mar;Password=nervi"; ;
                cn.Open();
            }

            OracleCommand command = new OracleCommand();
            command.Connection = cn;
            command.BindByName = true;
            command.CommandType = CommandType.Text;

            string sql = "SELECT     cm.structure_id, STRUCTURE_NAME, cf.comments, DEFAULT_LOCATION_ID || '-' || DEFAULT_SUBLOCATION_ID as location, formulation_name " +
                         " FROM      bottles.BOT_STRUCTURES_BINGO_T cb ,bottles.bot_structures_t cm, bottles.BOT_FORMULATIONS_T cf" +
                         " WHERE     CM.STRUCTURE_ID=CB.STRUCTURE_ID" +
                         " and  Cf.STRUCTURE_ID=CB.STRUCTURE_ID" +
                         " and bingo.exact (STRUCTURE_BINGO," +
                         " :struct " +
                         " , 'ALL') = 1";

            command.CommandText = sql;

            OracleParameter molecule = new OracleParameter("struct", OracleDbType.Clob);
            molecule.Direction = ParameterDirection.Input;
            molecule.Value = compound;

            command.Parameters.Add(molecule);

            DataSet tmprd = new DataSet("Structure");
            try
            {
                OracleDataReader reader = command.ExecuteReader();
                DataTable dt = new DataTable();
                dt.Load(reader);

                string js = Utility.GetJson(dt);
                return js;
            }
            catch (Exception ex)
            {
                throw ex;

            }
            finally
            {
                if (cn.State.Equals(System.Data.ConnectionState.Open)) { cn.Close(); }
            }
            return "";
        }

        [WebMethod(Description = "search chemtools")]
        public string MatchBingoChemtools(string compound, string cns)
        {

            if (compound == "empty")
            {
                compound =
                    "\n" +
                    "  -ISIS-  03191415482D\n" +
                    "\n" +
                    "  6  6  0  0  0  0  0  0  0  0999 V2000\n" +
                    "    3.9694   -2.6875    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
                    "    3.9682   -3.5148    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
                    "    4.6831   -3.9277    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
                    "    5.3995   -3.5144    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
                    "    5.3966   -2.6838    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
                    "    4.6813   -2.2747    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
                    "  3  4  2  0  0  0  0\n" +
                    "  2  3  1  0  0  0  0\n" +
                    "  4  5  1  0  0  0  0\n" +
                    "  1  2  2  0  0  0  0\n" +
                    "  5  6  2  0  0  0  0\n" +
                    "  6  1  1  0  0  0  0\n" +
                    "M  END";
            }

            if (cns == "")
            {
                cns = conn;
            }
            OracleConnection cn = new OracleConnection();
            if (cn.State != ConnectionState.Open)
            {
                cn.ConnectionString = "Data Source=nmsdd;Persist Security Info=True;User ID=mar;Password=nervi"; ;
                cn.Open();
            }

            OracleCommand command = new OracleCommand();
            command.Connection = cn;
            command.BindByName = true;
            command.CommandType = CommandType.Text;

            string sql = "SELECT   (select firstname ||  ' ' || lastname from mar_people_t where initials = cl.batch_resp) as  batch_resp,  cmp_id, cl.batch, cl.submission_date" +
                  " FROM    mar_corp_lot_t cl" +
                  " WHERE    cmp_id IN (SELECT   cmp_id" +
                  "                           FROM   mar_corp_str_assoc_t" +
                  "                          WHERE   str_id IN (SELECT     str_id" +
                  "                                                      FROM     mar_compound_bingo_t" +
                  "                                                    WHERE     bingo.exact (compound," +
                  "                                                               :struct        " +
                  "                                                                               , 'ALL') = 1))     ";

            command.CommandText = sql;

            OracleParameter molecule = new OracleParameter("struct", OracleDbType.Clob);
            molecule.Direction = ParameterDirection.Input;
            molecule.Value = compound;

            command.Parameters.Add(molecule);

            DataSet tmprd = new DataSet("Structure");
            try
            {
                OracleDataReader reader = command.ExecuteReader();
                DataTable dt = new DataTable();
                dt.Load(reader);

                string js = Utility.GetJson(dt);
                return js;
            }
            catch (Exception ex)
            {
                throw ex;

            }
            finally
            {
                if (cn.State.Equals(System.Data.ConnectionState.Open)) { cn.Close(); }
            }
            return "";
        }

        [WebMethod(Description = "search chemtools")]
        public string MatchBingoChemtoolsSP(string compound)
        {

            if (compound == "empty")
            {
                compound =
"\n" +
"-INDIGO-05211416322D\n" +
"\n" +
" 10 10  0  0  0  0  0  0  0  0999 V2000\n" +
"    0.0000    0.5000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
"    0.0000   -0.5000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
"    0.8660   -1.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
"    1.7321   -0.5000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
"    1.7321    0.5000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
"    0.8660    1.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
"    2.5981    1.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
"    3.4641    0.5000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
"    3.4641   -0.5000    0.0000 Cl  0  0  0  0  0  0  0  0  0  0  0  0\n" +
"    4.3301    1.0000    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n" +
"  2  3  1  0  0  0  0\n" +
"  4  5  1  0  0  0  0\n" +
"  1  2  2  0  0  0  0\n" +
"  5  7  1  0  0  0  0\n" +
"  5  6  2  0  0  0  0\n" +
"  7  8  1  0  0  0  0\n" +
"  6  1  1  0  0  0  0\n" +
"  8  9  1  0  0  0  0\n" +
"  3  4  2  0  0  0  0\n" +
"  8 10  2  0  0  0  0\n" +
"M  END";
            }

            OracleConnection cn = new OracleConnection();
            if (cn.State != ConnectionState.Open)
            {
                cn.ConnectionString = "Data Source=nmsdd;Persist Security Info=True;User ID=mar;Password=nervi"; ;
                cn.Open();
            }

            OracleCommand command = new OracleCommand();
            command.Connection = cn;
            command.BindByName = true;
            command.CommandText = "nmscore.match_molecule_bingo.get_data";

            command.CommandType = CommandType.StoredProcedure;
            OracleParameter ret = new OracleParameter("ret", OracleDbType.RefCursor);
            ret.Direction = ParameterDirection.Output;

            OracleParameter molecule = new OracleParameter("struct", OracleDbType.Clob);
            molecule.Direction = ParameterDirection.Input;
            molecule.Value = compound;

            command.Parameters.Add(molecule);
            command.Parameters.Add(ret);

            DataSet tmprd = new DataSet("Structure");
            try
            {
                command.ExecuteNonQuery();
                OracleDataAdapter da = new OracleDataAdapter();
                da.SelectCommand = command;
                da.Fill(tmprd);
                string js = Utility.GetJson(tmprd.Tables[0]);
                return js;
            }
            catch (Exception ex)
            {
                throw ex;

            }
            finally
            {
                if (cn.State.Equals(System.Data.ConnectionState.Open)) { cn.Close(); }
            }
            return "";
        }
        
        [WebMethod(Description = "search reaction")]
        public string MatchBingoReaction(string compound, string searchType, string cns)
        {

            if (compound=="empty")
            {
                compound =
"$RXN\n" +
"\n" +
"      ISIS     031920141548\n" +
"\n" +
"  0  1\n" +
"$MOL\n" +
"\n" +
"  -ISIS-  03191415482D\n" +
"\n" +
"  6  6  0  0  0  0  0  0  0  0999 V2000\n" +
"    3.9694   -2.6875    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
"    3.9682   -3.5148    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
"    4.6831   -3.9277    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
"    5.3995   -3.5144    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
"    5.3966   -2.6838    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
"    4.6813   -2.2747    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
"  3  4  2  0  0  0  0\n" +
"  2  3  1  0  0  0  0\n" +
"  4  5  1  0  0  0  0\n" +
"  1  2  2  0  0  0  0\n" +
"  5  6  2  0  0  0  0\n" +
"  6  1  1  0  0  0  0\n" +
"M  END";                
            }

            if (searchType=="")
            {
                searchType = "SSS";
            }
            if (cns=="")
            {
                cns = conn;
            }
            OracleConnection cn = new OracleConnection();
            if (cn.State != ConnectionState.Open)
            {
                cn.ConnectionString = cns;
                cn.Open();
            }

            OracleCommand command = new OracleCommand();
            command.Connection = cn;
            command.BindByName = true;
            command.CommandText = "CEN_DEV_OWNER.match.reaction";

            command.CommandType = CommandType.StoredProcedure;
            OracleParameter ret = new OracleParameter("ret", OracleDbType.RefCursor);
            ret.Direction = ParameterDirection.Output;

            OracleParameter searchTy = new OracleParameter("searchType", OracleDbType.Varchar2);
            searchTy.Direction = ParameterDirection.Input;
            searchTy.Value = searchType;

            OracleParameter molecule = new OracleParameter("struct", OracleDbType.Clob);
            molecule.Direction = ParameterDirection.Input;
            molecule.Value = compound;

            command.Parameters.Add(searchTy);
            command.Parameters.Add(molecule);
            command.Parameters.Add(ret);

            DataSet tmprd = new DataSet("Structure");
            try
            {
                command.ExecuteNonQuery();
                OracleDataAdapter da = new OracleDataAdapter();
                da.SelectCommand = command;
                da.Fill(tmprd);
                string js = Utility.GetJson(tmprd.Tables[0]);
                return js ;
            }
            catch (Exception ex)
            {
                throw ex;

            }
            finally
            {
                if (cn.State.Equals(System.Data.ConnectionState.Open)) { cn.Close(); }
            }
            return "";
        }

        public DataTable MatchBingoReactionDt(string compound, string searchType, string cns)
        {

            if (compound == "empty")
            {
                compound =
"$RXN\n" +
"\n" +
"      ISIS     031920141548\n" +
"\n" +
"  0  1\n" +
"$MOL\n" +
"\n" +
"  -ISIS-  03191415482D\n" +
"\n" +
"  6  6  0  0  0  0  0  0  0  0999 V2000\n" +
"    3.9694   -2.6875    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
"    3.9682   -3.5148    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
"    4.6831   -3.9277    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
"    5.3995   -3.5144    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
"    5.3966   -2.6838    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
"    4.6813   -2.2747    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
"  3  4  2  0  0  0  0\n" +
"  2  3  1  0  0  0  0\n" +
"  4  5  1  0  0  0  0\n" +
"  1  2  2  0  0  0  0\n" +
"  5  6  2  0  0  0  0\n" +
"  6  1  1  0  0  0  0\n" +
"M  END";
            }

            if (searchType == "")
            {
                searchType = "SSS";
            }
            if (cns == "")
            {
                cns = conn;
            }
            OracleConnection cn = new OracleConnection();
            if (cn.State != ConnectionState.Open)
            {
                cn.ConnectionString = cns;
                cn.Open();
            }

            OracleCommand command = new OracleCommand();
            command.Connection = cn;
            command.BindByName = true;
            command.CommandText = "CEN_DEV_OWNER.match.reaction";

            command.CommandType = CommandType.StoredProcedure;
            OracleParameter ret = new OracleParameter("ret", OracleDbType.RefCursor);
            ret.Direction = ParameterDirection.Output;

            OracleParameter searchTy = new OracleParameter("searchType", OracleDbType.Varchar2);
            searchTy.Direction = ParameterDirection.Input;
            searchTy.Value = searchType;

            OracleParameter molecule = new OracleParameter("struct", OracleDbType.Clob);
            molecule.Direction = ParameterDirection.Input;
            molecule.Value = compound;

            command.Parameters.Add(searchTy);
            command.Parameters.Add(molecule);
            command.Parameters.Add(ret);

            DataSet tmprd = new DataSet("Structure");
            try
            {
                command.ExecuteNonQuery();
                OracleDataAdapter da = new OracleDataAdapter();
                da.SelectCommand = command;
                da.Fill(tmprd);
                return tmprd.Tables[0];
            }
            catch (Exception ex)
            {
                throw ex;

            }
            finally
            {
                if (cn.State.Equals(System.Data.ConnectionState.Open)) { cn.Close(); }
            }
        }

        [WebMethod(Description = "search reaction")]
        public string MatchBingoReactionTest(Reazione rx)
        {
            if (rx.rxn == "empty")
            {
                rx.rxn =
"$RXN\n" +
"\n" +
"      ISIS     031920141548\n" +
"\n" +
"  0  1\n" +
"$MOL\n" +
"\n" +
"  -ISIS-  03191415482D\n" +
"\n" +
"  6  6  0  0  0  0  0  0  0  0999 V2000\n" +
"    3.9694   -2.6875    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
"    3.9682   -3.5148    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
"    4.6831   -3.9277    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
"    5.3995   -3.5144    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
"    5.3966   -2.6838    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
"    4.6813   -2.2747    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
"  3  4  2  0  0  0  0\n" +
"  2  3  1  0  0  0  0\n" +
"  4  5  1  0  0  0  0\n" +
"  1  2  2  0  0  0  0\n" +
"  5  6  2  0  0  0  0\n" +
"  6  1  1  0  0  0  0\n" +
"M  END";
            }

            if (rx.searchType == "")
            {
                rx.searchType = "SSS";
            }
            if (rx.cns == "")
            {
                rx.cns = conn;
            }
            OracleConnection cn = new OracleConnection();
            if (cn.State != ConnectionState.Open)
            {
                cn.ConnectionString = rx.cns;
                cn.Open();
            }

            OracleCommand command = new OracleCommand();
            command.Connection = cn;
            command.BindByName = true;
            command.CommandText = "CEN_DEV_OWNER.match.reaction";

            command.CommandType = CommandType.StoredProcedure;
            OracleParameter ret = new OracleParameter("ret", OracleDbType.RefCursor);
            ret.Direction = ParameterDirection.Output;

            OracleParameter searchTy = new OracleParameter("searchType", OracleDbType.Varchar2);
            searchTy.Direction = ParameterDirection.Input;
            searchTy.Value = rx.searchType;

            OracleParameter molecule = new OracleParameter("struct", OracleDbType.Clob);
            molecule.Direction = ParameterDirection.Input;
            molecule.Value = rx.rxn;

            command.Parameters.Add(searchTy);
            command.Parameters.Add(molecule);
            command.Parameters.Add(ret);

            DataSet tmprd = new DataSet("Structure");
            try
            {
                command.ExecuteNonQuery();
                OracleDataAdapter da = new OracleDataAdapter();
                da.SelectCommand = command;
                da.Fill(tmprd);
                string js = Utility.GetJson(tmprd.Tables[0]);
                return js;
            }
            catch (Exception ex)
            {
                throw ex;

            }
            finally
            {
                if (cn.State.Equals(System.Data.ConnectionState.Open)) { cn.Close(); }
            }
            return "";
        }

        [WebMethod(Description = "search reaction text")]
        public string MatchReactionText(string query, string cns)
        {
            if (cns == "")
            {
                cns = conn;
            }
            OracleConnection cn = new OracleConnection();
            if (cn.State != ConnectionState.Open)
            {
                cn.ConnectionString = cns;
                cn.Open();
            }

            OracleCommand command = new OracleCommand();
            command.Connection = cn;
            command.BindByName = true;
            command.CommandText = "CEN_DEV_OWNER.match.reactionText";

            command.CommandType = CommandType.StoredProcedure;
            OracleParameter ret = new OracleParameter("ret", OracleDbType.RefCursor);
            ret.Direction = ParameterDirection.Output;

            OracleParameter queryText = new OracleParameter("queryText", OracleDbType.Varchar2);
            queryText.Direction = ParameterDirection.Input;
            queryText.Value = query.Replace('"','\'');

            command.Parameters.Add(queryText);
            command.Parameters.Add(ret);

            DataSet tmprd = new DataSet("Structure");
            try
            {
                command.ExecuteNonQuery();
                OracleDataAdapter da = new OracleDataAdapter();
                da.SelectCommand = command;
                da.Fill(tmprd);
                string js = Utility.GetJson(tmprd.Tables[0]);
                return js;
            }
            catch (Exception ex)
            {
                throw ex;

            }
            finally
            {
                if (cn.State.Equals(System.Data.ConnectionState.Open)) { cn.Close(); }
            }
            return "";
        }

        [WebMethod(Description = "test molecule")]
        public string TestMolecule()
        {
            com.ggasoftware.indigo.Indigo indigo = new Indigo();
            IndigoRenderer indigoRenderer = new IndigoRenderer(indigo);
            IndigoObject m = indigo.loadMolecule("[O-][N+](=O)C1=CN2CC3(CCN(CC3)C(=O)OCC3=CC=C(C=C3)C(F)(F)F)OC2=N1");
            indigo.setOption("render-comment", "");
            indigo.setOption("render-output-format", "png");
            //indigoRenderer.renderToFile(m, @"c:\temp\render.png");
            Bitmap image = indigoRenderer.renderToBitmap(m);

            using (MemoryStream ms = new MemoryStream())
            {
                // Convert Image to byte[]
                image.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
                byte[] imageBytes = ms.ToArray();

                // Convert byte[] to Base64 String
                string base64String = Convert.ToBase64String(imageBytes);
                return base64String;
            }

        }

        [WebMethod(Description = "test molecule")]
        public string TestEnumeration()
        {
            string[][] r = new string[2][] { new string[] { "C(=O)O", "CC(=O)O", "CCC(=O)O", "CCCC(=O)O" }, new string[] { "CN", "CCN", "CCCN" } };

            Indigo indigo = new Indigo();

            IndigoObject reaction = indigo.loadQueryReaction(enum1);
            IndigoObject monomers_table = indigo.createArray();

            for (int i = 0; i < reaction.countReactants(); i++)
            {
                monomers_table.arrayAdd(indigo.createArray());

                foreach (string[] item in r)
                {
                    foreach (string item0 in item)
                    {
                        IndigoObject rea1 = indigo.loadMolecule(item0);
                        monomers_table.at(i).arrayAdd(rea1);
                    }
                }
            }
            IndigoObject output_reactions = indigo.reactionProductEnumerate(reaction, monomers_table);
            IndigoRenderer indigoRenderer = new IndigoRenderer(indigo);
            indigo.setOption("render-grid-title-property", "Enumeration");
            indigo.setOption("render-coloring", "true");
            indigo.setOption("render-output-format", "png");
            indigoRenderer.renderGridToFile(output_reactions, null, 1, "c:/tmp/indigo_grid_white.png");

            string ret = "";
            foreach (IndigoObject item in output_reactions.iterateArray())
            {
                Dictionary<string, string> reag = new Dictionary<string, string>();

                IndigoObject m = indigo.loadReaction(item.rxnfile());
                Bitmap image = indigoRenderer.renderToBitmap(m);
                using (MemoryStream ms = new MemoryStream())
                {
                    // Convert Image to byte[]
                    image.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
                    byte[] imageBytes = ms.ToArray();

                    // Convert byte[] to Base64 String
                    string base64String = Convert.ToBase64String(imageBytes);
                    //return base64String;
                    reag.Add("RXN", base64String);

                    JavaScriptSerializer js = new JavaScriptSerializer();
                    string json = js.Serialize(reag);

                    ret = ret + json + ",";
                }


            }
            ret = ret.TrimEnd(',');

            return "[" + ret + "]";
        }

        [WebMethod(Description = "test molecule")]
        public string TestReaction(string rxn)
        {
            com.ggasoftware.indigo.Indigo indigo = new Indigo();
            IndigoRenderer indigoRenderer = new IndigoRenderer(indigo);
            IndigoObject m = indigo.loadReaction(rxn);
            //foreach (IndigoObject item in m.iterateReactants())
            //    System.Console.WriteLine(item.molfile());

            return m.countReactants().ToString() + " " + m.countProducts().ToString();
        }

        [WebMethod(Description = "get reaction")]
        public string TestGetJson(string reactionId, string cns, string outType)
        {
            if (outType == "")
            {
                outType = "json";
            }
            if (cns == "")
            {
                cns = "Data Source=xe;Persist Security Info=True;User ID=easycertlist;Password=easycertlist"; ;
            }
            OracleConnection cn = new OracleConnection();
            if (cn.State != ConnectionState.Open)
            {
                cn.ConnectionString = cns;
                cn.Open();
            }

            OracleCommand command = new OracleCommand();
            command.Connection = cn;

            if (reactionId == "")
            {
                reactionId = "99fb84942ace51d341c9cf4b51487a99919c695e";
            }

            try
            {
                OracleCommand oraCommand = new OracleCommand("SELECT box_nome as reaction " +
                    "FROM box r ", command.Connection);
                OracleDataReader reader = oraCommand.ExecuteReader();
                DataTable dt = new DataTable();
                dt.Load(reader);

                if (dt.Rows.Count > 0)
                {
                    string js = "";
                    if (outType == "json")
                    {
                        js = Utility.GetJson(dt);
                    }
                    else if (outType == "txt")
                    {
                        js = dt.Rows[0].ItemArray[0].ToString();
                    }
                    return js;
                }
                else
                {
                    return "";
                }

            }
            catch (Exception ex)
            {
                throw ex;

            }
            finally
            {
                if (cn.State.Equals(System.Data.ConnectionState.Open)) { cn.Close(); }
            }
            return "";
        }

        [WebMethod]
        [ScriptMethod(UseHttpGet = true, ResponseFormat = ResponseFormat.Json)] 
        public string TestJson(string fname)
        {
            var obj = new Lad
            {
                firstName = fname,
                lastName = "Chaney",
                dateOfBirth = new MyDate
                {
                    year = 1901,
                    month = 4,
                    day = 30
                }
            };
            var json = new JavaScriptSerializer().Serialize(obj);
            return json;
        }

        [WebMethod(Description = "test")]
        public string TestArr(string[] list)
        {
            string ret = "";
            foreach (string item in list)
            {
                ret = ret + item;
            }
            return ret;
        }

        [WebMethod(Description = "insert new experiment")]
        public string UpdateDetail(string detail)
        {
            OracleConnection cn = new OracleConnection();
            if (cn.State != ConnectionState.Open)
            {
                cn.ConnectionString = conn;
                cn.Open();
            }

            OracleCommand command = new OracleCommand();
            command.Connection = cn;
            command.BindByName = true;
            command.CommandText = "CEN_DEV_OWNER.reg.update_detail";

            command.CommandType = CommandType.StoredProcedure;
            OracleParameter ret = new OracleParameter("ret", OracleDbType.Int16);
            ret.Size = 500;
            ret.Direction = ParameterDirection.Output;

            OracleParameter detailO = new OracleParameter("detail", OracleDbType.Clob);
            detailO.Direction = ParameterDirection.Input;
            detailO.Value = detail;

            command.Parameters.Add(detailO);
            command.Parameters.Add(ret);

            DataSet tmprd = new DataSet("Structure");
            try
            {
                command.ExecuteNonQuery();
                return ret.Value.ToString();
            }
            catch (Exception ex)
            {
                throw ex;

            }
            finally
            {
                if (cn.State.Equals(System.Data.ConnectionState.Open)) { cn.Close(); }
            }
            return "";
        }

        [WebMethod(Description = "update reaction procedure")]
        public string UpdateProcedura(string procedura, string notebook, string page)
        {
            OracleConnection cn = new OracleConnection();
            if (cn.State != ConnectionState.Open)
            {
                cn.ConnectionString = conn;
                cn.Open();
            }

            OracleCommand command = new OracleCommand();
            command.Connection = cn;
            command.BindByName = true;
            command.CommandText = "CEN_DEV_OWNER.reg.update_procedure";

            command.CommandType = CommandType.StoredProcedure;
            OracleParameter ret = new OracleParameter("ret", OracleDbType.Int16);
            ret.Size = 500;
            ret.Direction = ParameterDirection.Output;

            OracleParameter nb = new OracleParameter("nb", OracleDbType.Varchar2);
            nb.Direction = ParameterDirection.Input;
            nb.Value = notebook;

            OracleParameter exper = new OracleParameter("exper", OracleDbType.Varchar2);
            exper.Direction = ParameterDirection.Input;
            exper.Value = page;

            OracleParameter rxno = new OracleParameter("procedura", OracleDbType.Clob);
            rxno.Direction = ParameterDirection.Input;
            rxno.Value = procedura;

            command.Parameters.Add(nb);
            command.Parameters.Add(exper);
            command.Parameters.Add(rxno);
            command.Parameters.Add(ret);

            DataSet tmprd = new DataSet("Structure");
            try
            {
                command.ExecuteNonQuery();
                return ret.Value.ToString();
            }
            catch (Exception ex)
            {
                throw ex;

            }
            finally
            {
                if (cn.State.Equals(System.Data.ConnectionState.Open)) { cn.Close(); }
            }
            return "";
        }

        [WebMethod(Description = "update reaction scheme")]
        public string UpdateSchema(string rxn, string notebook, string page, string enumVal)
        {
            OracleConnection cn = new OracleConnection();
            if (cn.State != ConnectionState.Open)
            {
                cn.ConnectionString = conn;
                cn.Open();
            }

            OracleCommand command = new OracleCommand();
            command.Connection = cn;
            command.BindByName = true;
            command.CommandText = "CEN_DEV_OWNER.reg.update_schema";

            command.CommandType = CommandType.StoredProcedure;
            OracleParameter ret = new OracleParameter("ret", OracleDbType.Int16);
            ret.Size = 500;
            ret.Direction = ParameterDirection.Output;

            OracleParameter eV = new OracleParameter("enumVal", OracleDbType.Varchar2);
            eV.Direction = ParameterDirection.Input;
            eV.Value = enumVal;

            OracleParameter nb = new OracleParameter("nb", OracleDbType.Varchar2);
            nb.Direction = ParameterDirection.Input;
            nb.Value = notebook;

            OracleParameter exper = new OracleParameter("exper", OracleDbType.Varchar2);
            exper.Direction = ParameterDirection.Input;
            exper.Value = page;
            
            OracleParameter rxno = new OracleParameter("struct", OracleDbType.Clob);
            rxno.Direction = ParameterDirection.Input;
            rxno.Value = rxn;

            command.Parameters.Add(eV);
            command.Parameters.Add(nb);
            command.Parameters.Add(exper);
            command.Parameters.Add(rxno);
            command.Parameters.Add(ret);

            DataSet tmprd = new DataSet("Structure");
            try
            {
                command.ExecuteNonQuery();
                return ret.Value.ToString();
            }
            catch (Exception ex)
            {
                throw ex;

            }
            finally
            {
                if (cn.State.Equals(System.Data.ConnectionState.Open)) { cn.Close(); }
            }
            return "";
        }

        [WebMethod(Description = "update reaction stoichiometry")]
        public string UpdateStoic(string Reagents, string Products, string username, string notebook, string page)
        {
            OracleConnection cn = new OracleConnection();
            if (cn.State != ConnectionState.Open)
            {
                cn.ConnectionString = conn;
                cn.Open();
            }

            OracleCommand command = new OracleCommand();
            command.Connection = cn;
            command.BindByName = true;
            command.CommandText = "CEN_DEV_OWNER.reg.update_stoic";

            command.CommandType = CommandType.StoredProcedure;
            OracleParameter ret = new OracleParameter("ret", OracleDbType.Int16);
            ret.Size = 500;
            ret.Direction = ParameterDirection.Output;

            OracleParameter nb = new OracleParameter("nb", OracleDbType.Varchar2);
            nb.Direction = ParameterDirection.Input;
            nb.Value = notebook;

            OracleParameter exper = new OracleParameter("exper", OracleDbType.Varchar2);
            exper.Direction = ParameterDirection.Input;
            exper.Value = page;

            OracleParameter rea = new OracleParameter("Reagents", OracleDbType.Clob);
            rea.Direction = ParameterDirection.Input;
            rea.Value = Reagents;

            OracleParameter pro = new OracleParameter("Products", OracleDbType.Clob);
            pro.Direction = ParameterDirection.Input;
            pro.Value = Products;

            OracleParameter name = new OracleParameter("username", OracleDbType.Clob);
            name.Direction = ParameterDirection.Input;
            name.Value = username;
            
            command.Parameters.Add(nb);
            command.Parameters.Add(exper);
            command.Parameters.Add(rea);
            command.Parameters.Add(pro);
            command.Parameters.Add(name);
            command.Parameters.Add(ret);

            DataSet tmprd = new DataSet("Structure");
            try
            {
                command.ExecuteNonQuery();
                return ret.Value.ToString();
            }
            catch (Exception ex)
            {
                throw ex;

            }
            finally
            {
                if (cn.State.Equals(System.Data.ConnectionState.Open)) { cn.Close(); }
            }
            return "";
        }

        [WebMethod]
        public string HelloWorld()
        {
            return conn;
        }

        string enum1 = "$RXN\n" +
            "\n" +
            "\n" +
            "\n" +
            "  2  1  0\n" +
            "$MOL\n" +
            "\n" +
            "  Ketcher 05261412232D 1   1.00000     0.00000     0\n"+
            "\n" +
            "  4  3  0     0  0            999 V2000\n" +
            "    0.0000   -0.7500    0.0000 R#  0  0  0  0  0  0  0  0  0  0  0  0\n" +
            "    0.8661   -0.2500    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
            "    1.7321   -0.7500    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n" +
            "    0.8661    0.7500    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n" +
            "  2  3  1  0     0  0\n" +
            "  1  2  1  0     0  0\n" +
            "  2  4  2  0     0  0\n" +
            "M  RGP  1   1   1\n" +
            "M  END\n" +
            "$MOL\n" +
            "\n" +
            "  Ketcher 05261412232D 1   1.00000     0.00000     0\n" +
            "\n" +
            "  2  1  0     0  0            999 V2000\n" +
            "    3.7321   -0.2500    0.0000 R#  0  0  0  0  0  0  0  0  0  0  0  0\n" +
            "    4.5982    0.2500    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n" +
            "  1  2  1  0     0  0\n" +
            "M  RGP  1   1   2\n" +
            "M  END\n" +
            "$MOL\n" +
            "\n" +
            "  Ketcher 05261412232D 1   1.00000     0.00000     0\n" +
            "\n" +
            "  5  4  0     0  0            999 V2000\n" +
            "   10.5982   -0.7500    0.0000 R#  0  0  0  0  0  0  0  0  0  0  0  0\n" +
            "   11.4642   -0.2500    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n" +
            "   12.3301   -0.7500    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n" +
            "   11.4642    0.7500    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n" +
            "   13.1962   -0.2500    0.0000 R#  0  0  0  0  0  0  0  0  0  0  0  0\n" +
            "  1  2  1  0     0  0\n" +
            "  2  4  2  0     0  0\n" +
            "  2  3  1  0     0  0\n" +
            "  3  5  1  0     0  0\n" +
            "M  RGP  2   1   1   5   2\n" +
            "M  END";

    }

    public class Reazione
    {
        public string rxn;
        public string searchType;
        public string cns;        
    }

    public class MyDate
    {
        public int year;
        public int month;
        public int day;
    }

    public class Lad
    {
        public string firstName;
        public string lastName;
        public MyDate dateOfBirth;
    }
}
