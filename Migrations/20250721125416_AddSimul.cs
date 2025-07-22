using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OutilRentabilite.Migrations
{
    /// <inheritdoc />
    public partial class AddSimul : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ProduitsFinanciers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    Nom = table.Column<string>(type: "NVARCHAR2(2000)", nullable: false),
                    TypeProduit = table.Column<string>(type: "NVARCHAR2(2000)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProduitsFinanciers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ParametresSimulations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    ProduitFinancierId = table.Column<int>(type: "NUMBER(10)", nullable: false),
                    Montant = table.Column<decimal>(type: "DECIMAL(18, 2)", nullable: false),
                    DureeMois = table.Column<int>(type: "NUMBER(10)", nullable: false),
                    TauxInteret = table.Column<float>(type: "BINARY_FLOAT", nullable: false),
                    FraisDossier = table.Column<decimal>(type: "DECIMAL(18, 2)", nullable: false),
                    CoutFinancement = table.Column<decimal>(type: "DECIMAL(18, 2)", nullable: false),
                    CoutRisque = table.Column<decimal>(type: "DECIMAL(18, 2)", nullable: false),
                    CoutOperationnel = table.Column<decimal>(type: "DECIMAL(18, 2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ParametresSimulations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ParametresSimulations_ProduitsFinanciers_ProduitFinancierId",
                        column: x => x.ProduitFinancierId,
                        principalTable: "ProduitsFinanciers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ResultatsSimulations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "NUMBER(10)", nullable: false)
                        .Annotation("Oracle:Identity", "START WITH 1 INCREMENT BY 1"),
                    RevenuTotal = table.Column<decimal>(type: "DECIMAL(18, 2)", nullable: false),
                    CoutTotal = table.Column<decimal>(type: "DECIMAL(18, 2)", nullable: false),
                    BeneficeNet = table.Column<decimal>(type: "DECIMAL(18, 2)", nullable: false),
                    MargeNette = table.Column<float>(type: "BINARY_FLOAT", nullable: false),
                    ROI = table.Column<float>(type: "BINARY_FLOAT", nullable: false),
                    ROE = table.Column<float>(type: "BINARY_FLOAT", nullable: false),
                    ROA = table.Column<float>(type: "BINARY_FLOAT", nullable: false),
                    ParametresSimulationId = table.Column<int>(type: "NUMBER(10)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ResultatsSimulations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ResultatsSimulations_ParametresSimulations_ParametresSimulationId",
                        column: x => x.ParametresSimulationId,
                        principalTable: "ParametresSimulations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ParametresSimulations_ProduitFinancierId",
                table: "ParametresSimulations",
                column: "ProduitFinancierId");

            migrationBuilder.CreateIndex(
                name: "IX_ResultatsSimulations_ParametresSimulationId",
                table: "ResultatsSimulations",
                column: "ParametresSimulationId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ResultatsSimulations");

            migrationBuilder.DropTable(
                name: "ParametresSimulations");

            migrationBuilder.DropTable(
                name: "ProduitsFinanciers");
        }
    }
}
