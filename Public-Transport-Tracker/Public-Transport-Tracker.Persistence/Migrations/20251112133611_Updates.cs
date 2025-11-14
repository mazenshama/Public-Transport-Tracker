using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Public_Transport_Tracker.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Updates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Driver",
                table: "Driver");

            migrationBuilder.RenameTable(
                name: "Driver",
                newName: "Drivers");

            migrationBuilder.RenameIndex(
                name: "IX_Driver_Email",
                table: "Drivers",
                newName: "IX_Drivers_Email");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Drivers",
                table: "Drivers",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Buses_CurrentDriverId",
                table: "Buses",
                column: "CurrentDriverId");

            migrationBuilder.AddForeignKey(
                name: "FK_Buses_Drivers_CurrentDriverId",
                table: "Buses",
                column: "CurrentDriverId",
                principalTable: "Drivers",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Buses_Drivers_CurrentDriverId",
                table: "Buses");

            migrationBuilder.DropIndex(
                name: "IX_Buses_CurrentDriverId",
                table: "Buses");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Drivers",
                table: "Drivers");

            migrationBuilder.RenameTable(
                name: "Drivers",
                newName: "Driver");

            migrationBuilder.RenameIndex(
                name: "IX_Drivers_Email",
                table: "Driver",
                newName: "IX_Driver_Email");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Driver",
                table: "Driver",
                column: "Id");
        }
    }
}
