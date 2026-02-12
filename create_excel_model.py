#!/usr/bin/env python3
"""
Create an Excel model for the Sovereign Asset Valuation Engine (SAVE)
This replicates the web calculator functionality in Excel with formulas.
"""

from openpyxl import Workbook
from openpyxl.styles import Font, Fill, PatternFill, Border, Side, Alignment, NamedStyle
from openpyxl.utils import get_column_letter
from openpyxl.formatting.rule import DataBarRule

def create_save_model(filename="SAVE_Model.xlsx"):
    wb = Workbook()
    ws = wb.active
    ws.title = "SAVE Calculator"

    # Define styles
    header_font = Font(bold=True, size=14, color="FFFFFF")
    section_font = Font(bold=True, size=12, color="F59E0B")  # Amber
    label_font = Font(size=11, color="D1D5DB")  # Gray
    input_font = Font(size=11, color="FFFFFF")
    output_font = Font(size=11, color="FFFFFF")
    result_font = Font(bold=True, size=14, color="F59E0B")

    header_fill = PatternFill(start_color="1F2937", end_color="1F2937", fill_type="solid")  # Dark gray
    input_fill = PatternFill(start_color="374151", end_color="374151", fill_type="solid")  # Medium gray
    output_fill = PatternFill(start_color="1F2937", end_color="1F2937", fill_type="solid")
    highlight_fill = PatternFill(start_color="78350F", end_color="78350F", fill_type="solid")  # Amber dark
    income_fill = PatternFill(start_color="1E3A5F", end_color="1E3A5F", fill_type="solid")  # Blue
    asset_fill = PatternFill(start_color="14532D", end_color="14532D", fill_type="solid")  # Green

    thin_border = Border(
        left=Side(style='thin', color='4B5563'),
        right=Side(style='thin', color='4B5563'),
        top=Side(style='thin', color='4B5563'),
        bottom=Side(style='thin', color='4B5563')
    )

    # Set column widths
    ws.column_dimensions['A'].width = 3
    ws.column_dimensions['B'].width = 35
    ws.column_dimensions['C'].width = 20
    ws.column_dimensions['D'].width = 5
    ws.column_dimensions['E'].width = 35
    ws.column_dimensions['F'].width = 25
    ws.column_dimensions['G'].width = 3

    # =========================================
    # TITLE
    # =========================================
    ws.merge_cells('B2:F2')
    ws['B2'] = "Sovereign Asset Valuation Engine (SAVE)"
    ws['B2'].font = Font(bold=True, size=18, color="F59E0B")
    ws['B2'].fill = header_fill

    ws.merge_cells('B3:F3')
    ws['B3'] = "Calculate Real Wealth in Gold Ounces using the Consolidated Imperial Valuation (CIV) methodology"
    ws['B3'].font = Font(size=10, color="9CA3AF")
    ws['B3'].fill = header_fill

    # =========================================
    # INPUT SECTION (Left Column)
    # =========================================
    row = 5

    # Section Header
    ws[f'B{row}'] = "INPUT PARAMETERS"
    ws[f'B{row}'].font = section_font
    ws[f'B{row}'].fill = header_fill
    ws.merge_cells(f'B{row}:C{row}')
    row += 2

    # Ruler Name
    ws[f'B{row}'] = "Ruler/Empire Name"
    ws[f'B{row}'].font = label_font
    ws[f'C{row}'] = "Akbar the Great (Mughal Empire)"
    ws[f'C{row}'].font = input_font
    ws[f'C{row}'].fill = input_fill
    ws[f'C{row}'].border = thin_border
    ruler_name_cell = f'C{row}'
    row += 1

    # Year
    ws[f'B{row}'] = "Year"
    ws[f'B{row}'].font = label_font
    ws[f'C{row}'] = 1600
    ws[f'C{row}'].font = input_font
    ws[f'C{row}'].fill = input_fill
    ws[f'C{row}'].border = thin_border
    year_cell = f'C{row}'
    row += 2

    # Income Parameters Header
    ws[f'B{row}'] = "Income Parameters"
    ws[f'B{row}'].font = Font(bold=True, size=11, color="60A5FA")
    row += 1

    # Population
    ws[f'B{row}'] = "Population (N)"
    ws[f'B{row}'].font = label_font
    ws[f'C{row}'] = 110000000
    ws[f'C{row}'].font = input_font
    ws[f'C{row}'].fill = input_fill
    ws[f'C{row}'].border = thin_border
    ws[f'C{row}'].number_format = '#,##0'
    pop_cell = f'C{row}'
    row += 1

    # Base Output
    ws[f'B{row}'] = "Base Output (B) oz/person/year"
    ws[f'B{row}'].font = label_font
    ws[f'C{row}'] = 0.75
    ws[f'C{row}'].font = input_font
    ws[f'C{row}'].fill = input_fill
    ws[f'C{row}'].border = thin_border
    ws[f'C{row}'].number_format = '0.00'
    base_output_cell = f'C{row}'
    row += 1

    # Velocity
    ws[f'B{row}'] = "Velocity (V) [2.0-8.0]"
    ws[f'B{row}'].font = label_font
    ws[f'C{row}'] = 4.5
    ws[f'C{row}'].font = input_font
    ws[f'C{row}'].fill = input_fill
    ws[f'C{row}'].border = thin_border
    ws[f'C{row}'].number_format = '0.0'
    velocity_cell = f'C{row}'
    row += 1

    # Extraction Margin
    ws[f'B{row}'] = "Extraction Margin (M) [0.01-0.50]"
    ws[f'B{row}'].font = label_font
    ws[f'C{row}'] = 0.10
    ws[f'C{row}'].font = input_font
    ws[f'C{row}'].fill = input_fill
    ws[f'C{row}'].border = thin_border
    ws[f'C{row}'].number_format = '0.00'
    margin_cell = f'C{row}'
    row += 1

    # Capitalization Multiple
    ws[f'B{row}'] = "Capitalization Multiple (K) [1-100]"
    ws[f'B{row}'].font = label_font
    ws[f'C{row}'] = 20
    ws[f'C{row}'].font = input_font
    ws[f'C{row}'].fill = input_fill
    ws[f'C{row}'].border = thin_border
    ws[f'C{row}'].number_format = '0'
    cap_mult_cell = f'C{row}'
    row += 2

    # Asset Parameters Header
    ws[f'B{row}'] = "Asset Parameters (Balance Sheet)"
    ws[f'B{row}'].font = Font(bold=True, size=11, color="34D399")
    row += 1

    # Liquid Treasury
    ws[f'B{row}'] = "Liquid Treasury (L) oz"
    ws[f'B{row}'].font = label_font
    ws[f'C{row}'] = 50000000
    ws[f'C{row}'].font = input_font
    ws[f'C{row}'].fill = input_fill
    ws[f'C{row}'].border = thin_border
    ws[f'C{row}'].number_format = '#,##0'
    treasury_cell = f'C{row}'
    row += 1

    # Imperial Real Estate
    ws[f'B{row}'] = "Imperial Real Estate (R) oz"
    ws[f'B{row}'].font = label_font
    ws[f'C{row}'] = 10000000
    ws[f'C{row}'].font = input_font
    ws[f'C{row}'].fill = input_fill
    ws[f'C{row}'].border = thin_border
    ws[f'C{row}'].number_format = '#,##0'
    real_estate_cell = f'C{row}'
    row += 1

    # Extraordinary Gains
    ws[f'B{row}'] = "Extraordinary Gains (E) oz"
    ws[f'B{row}'].font = label_font
    ws[f'C{row}'] = 5000000
    ws[f'C{row}'].font = input_font
    ws[f'C{row}'].fill = input_fill
    ws[f'C{row}'].border = thin_border
    ws[f'C{row}'].number_format = '#,##0'
    extra_gains_cell = f'C{row}'
    row += 2

    # Valuation Settings Header
    ws[f'B{row}'] = "Valuation Settings"
    ws[f'B{row}'].font = Font(bold=True, size=11, color="F59E0B")
    row += 1

    # Gold Price
    ws[f'B{row}'] = "Gold Price ($/oz)"
    ws[f'B{row}'].font = label_font
    ws[f'C{row}'] = 2900
    ws[f'C{row}'].font = input_font
    ws[f'C{row}'].fill = input_fill
    ws[f'C{row}'].border = thin_border
    ws[f'C{row}'].number_format = '#,##0'
    gold_price_cell = f'C{row}'

    # =========================================
    # OUTPUT SECTION (Right Column)
    # =========================================
    row = 5

    # Output Header with ruler name
    ws[f'E{row}'] = f'={ruler_name_cell}&" ("&{year_cell}&")"'
    ws[f'E{row}'].font = Font(bold=True, size=14, color="F59E0B")
    ws.merge_cells(f'E{row}:F{row}')
    row += 2

    # Income Valuation Section
    ws[f'E{row}'] = "Income Valuation (Operating Business)"
    ws[f'E{row}'].font = Font(bold=True, size=12, color="60A5FA")
    ws.merge_cells(f'E{row}:F{row}')
    row += 1

    # AGR
    ws[f'E{row}'] = "Annual Gross Revenue (AGR)"
    ws[f'E{row}'].font = label_font
    ws[f'F{row}'] = f'={pop_cell}*{base_output_cell}*{velocity_cell}'
    ws[f'F{row}'].font = output_font
    ws[f'F{row}'].number_format = '#,##0" oz"'
    ws[f'F{row}'].alignment = Alignment(horizontal='right')
    agr_cell = f'F{row}'
    row += 1

    # AII
    ws[f'E{row}'] = "Annual Imperial Income (AII)"
    ws[f'E{row}'].font = label_font
    ws[f'F{row}'] = f'={agr_cell}*{margin_cell}'
    ws[f'F{row}'].font = output_font
    ws[f'F{row}'].number_format = '#,##0" oz"'
    ws[f'F{row}'].alignment = Alignment(horizontal='right')
    aii_cell = f'F{row}'
    row += 1

    # Income Wealth
    ws[f'E{row}'] = "Income Wealth (AII × K)"
    ws[f'E{row}'].font = Font(bold=True, size=11, color="FFFFFF")
    ws[f'F{row}'] = f'={aii_cell}*{cap_mult_cell}'
    ws[f'F{row}'].font = Font(bold=True, size=11, color="F59E0B")
    ws[f'F{row}'].number_format = '#,##0" oz"'
    ws[f'F{row}'].alignment = Alignment(horizontal='right')
    income_wealth_cell = f'F{row}'
    row += 2

    # Asset Valuation Section
    ws[f'E{row}'] = "Asset Valuation (Balance Sheet)"
    ws[f'E{row}'].font = Font(bold=True, size=12, color="34D399")
    ws.merge_cells(f'E{row}:F{row}')
    row += 1

    # Infrastructure Floor
    ws[f'E{row}'] = "Infrastructure Floor (I)"
    ws[f'E{row}'].font = label_font
    ws[f'F{row}'] = f'=({pop_cell}*{base_output_cell})*0.05'
    ws[f'F{row}'].font = output_font
    ws[f'F{row}'].number_format = '#,##0" oz"'
    ws[f'F{row}'].alignment = Alignment(horizontal='right')
    infra_cell = f'F{row}'
    row += 1

    # Liquid Treasury (display)
    ws[f'E{row}'] = "Liquid Treasury (L)"
    ws[f'E{row}'].font = label_font
    ws[f'F{row}'] = f'={treasury_cell}'
    ws[f'F{row}'].font = output_font
    ws[f'F{row}'].number_format = '#,##0" oz"'
    ws[f'F{row}'].alignment = Alignment(horizontal='right')
    row += 1

    # Imperial Real Estate (display)
    ws[f'E{row}'] = "Imperial Real Estate (R)"
    ws[f'E{row}'].font = label_font
    ws[f'F{row}'] = f'={real_estate_cell}'
    ws[f'F{row}'].font = output_font
    ws[f'F{row}'].number_format = '#,##0" oz"'
    ws[f'F{row}'].alignment = Alignment(horizontal='right')
    row += 1

    # Extraordinary Gains (display)
    ws[f'E{row}'] = "Extraordinary Gains (E)"
    ws[f'E{row}'].font = label_font
    ws[f'F{row}'] = f'={extra_gains_cell}'
    ws[f'F{row}'].font = output_font
    ws[f'F{row}'].number_format = '#,##0" oz"'
    ws[f'F{row}'].alignment = Alignment(horizontal='right')
    row += 1

    # Asset Wealth
    ws[f'E{row}'] = "Asset Wealth (I+L+R+E)"
    ws[f'E{row}'].font = Font(bold=True, size=11, color="FFFFFF")
    ws[f'F{row}'] = f'={infra_cell}+{treasury_cell}+{real_estate_cell}+{extra_gains_cell}'
    ws[f'F{row}'].font = Font(bold=True, size=11, color="34D399")
    ws[f'F{row}'].number_format = '#,##0" oz"'
    ws[f'F{row}'].alignment = Alignment(horizontal='right')
    asset_wealth_cell = f'F{row}'
    row += 2

    # Total Real Wealth Box
    ws[f'E{row}'] = "Total Real Wealth"
    ws[f'E{row}'].font = Font(bold=True, size=12, color="FFFFFF")
    ws[f'E{row}'].fill = highlight_fill
    ws[f'F{row}'] = f'={income_wealth_cell}+{asset_wealth_cell}'
    ws[f'F{row}'].font = Font(bold=True, size=14, color="F59E0B")
    ws[f'F{row}'].fill = highlight_fill
    ws[f'F{row}'].number_format = '#,##0" oz"'
    ws[f'F{row}'].alignment = Alignment(horizontal='right')
    total_wealth_cell = f'F{row}'
    row += 1

    # Total in full
    ws[f'E{row}'] = "(full number)"
    ws[f'E{row}'].font = Font(size=9, color="9CA3AF")
    ws[f'E{row}'].fill = highlight_fill
    ws[f'F{row}'] = f'={total_wealth_cell}'
    ws[f'F{row}'].font = Font(size=9, color="9CA3AF")
    ws[f'F{row}'].fill = highlight_fill
    ws[f'F{row}'].number_format = '#,##0" gold ounces"'
    ws[f'F{row}'].alignment = Alignment(horizontal='right')
    row += 2

    # Nominal Dollar Value Box
    ws[f'E{row}'] = "Nominal Dollar Value"
    ws[f'E{row}'].font = Font(bold=True, size=12, color="FFFFFF")
    ws[f'E{row}'].fill = highlight_fill
    ws[f'F{row}'] = f'={total_wealth_cell}*{gold_price_cell}'
    ws[f'F{row}'].font = Font(bold=True, size=14, color="34D399")
    ws[f'F{row}'].fill = highlight_fill
    ws[f'F{row}'].number_format = '$#,##0,," T"'
    ws[f'F{row}'].alignment = Alignment(horizontal='right')
    nominal_value_cell = f'F{row}'
    row += 1

    # Nominal in full
    ws[f'E{row}'] = f'@ ${gold_price_cell}/oz'
    ws[f'E{row}'] = f'=CONCATENATE("@ $",TEXT({gold_price_cell},"#,##0"),"/oz")'
    ws[f'E{row}'].font = Font(size=9, color="9CA3AF")
    ws[f'E{row}'].fill = highlight_fill
    ws[f'F{row}'] = f'={nominal_value_cell}'
    ws[f'F{row}'].font = Font(size=9, color="9CA3AF")
    ws[f'F{row}'].fill = highlight_fill
    ws[f'F{row}'].number_format = '$#,##0" USD"'
    ws[f'F{row}'].alignment = Alignment(horizontal='right')
    row += 2

    # =========================================
    # CFO DASHBOARD
    # =========================================
    ws[f'E{row}'] = "CFO Dashboard"
    ws[f'E{row}'].font = Font(bold=True, size=12, color="F59E0B")
    ws.merge_cells(f'E{row}:F{row}')
    row += 1

    # Income-to-Asset Ratio
    ws[f'E{row}'] = "Income-to-Asset Ratio"
    ws[f'E{row}'].font = label_font
    ws[f'F{row}'] = f'=IF({asset_wealth_cell}>0,{income_wealth_cell}/{asset_wealth_cell},0)'
    ws[f'F{row}'].font = Font(bold=True, size=11, color="60A5FA")
    ws[f'F{row}'].number_format = '0.00" x"'
    ws[f'F{row}'].alignment = Alignment(horizontal='right')
    row += 1

    # Extraction Efficiency
    ws[f'E{row}'] = "Extraction Efficiency"
    ws[f'E{row}'].font = label_font
    ws[f'F{row}'] = f'={margin_cell}'
    ws[f'F{row}'].font = Font(bold=True, size=11, color="60A5FA")
    ws[f'F{row}'].number_format = '0.0%'
    ws[f'F{row}'].alignment = Alignment(horizontal='right')
    row += 1

    # Per Capita Wealth
    ws[f'E{row}'] = "Per Capita Wealth"
    ws[f'E{row}'].font = label_font
    ws[f'F{row}'] = f'=IF({pop_cell}>0,{total_wealth_cell}/{pop_cell},0)'
    ws[f'F{row}'].font = Font(bold=True, size=11, color="60A5FA")
    ws[f'F{row}'].number_format = '0.00" oz"'
    ws[f'F{row}'].alignment = Alignment(horizontal='right')
    row += 1

    # Annual Yield
    ws[f'E{row}'] = "Annual Yield (AII / Total Wealth)"
    ws[f'E{row}'].font = label_font
    ws[f'F{row}'] = f'=IF({total_wealth_cell}>0,{aii_cell}/{total_wealth_cell},0)'
    ws[f'F{row}'].font = Font(bold=True, size=11, color="60A5FA")
    ws[f'F{row}'].number_format = '0.00%'
    ws[f'F{row}'].alignment = Alignment(horizontal='right')
    row += 2

    # Wealth Composition
    ws[f'E{row}'] = "Wealth Composition"
    ws[f'E{row}'].font = Font(bold=True, size=11, color="FFFFFF")
    row += 1

    ws[f'E{row}'] = "Income Wealth %"
    ws[f'E{row}'].font = label_font
    ws[f'F{row}'] = f'=IF({total_wealth_cell}>0,{income_wealth_cell}/{total_wealth_cell},0)'
    ws[f'F{row}'].font = output_font
    ws[f'F{row}'].number_format = '0.0%'
    ws[f'F{row}'].alignment = Alignment(horizontal='right')
    income_pct_cell = f'F{row}'
    row += 1

    ws[f'E{row}'] = "Asset Wealth %"
    ws[f'E{row}'].font = label_font
    ws[f'F{row}'] = f'=IF({total_wealth_cell}>0,{asset_wealth_cell}/{total_wealth_cell},0)'
    ws[f'F{row}'].font = output_font
    ws[f'F{row}'].number_format = '0.0%'
    ws[f'F{row}'].alignment = Alignment(horizontal='right')
    row += 2

    # =========================================
    # FORMULAS REFERENCE
    # =========================================
    ws[f'E{row}'] = "Formulas Reference"
    ws[f'E{row}'].font = Font(bold=True, size=11, color="9CA3AF")
    row += 1

    formulas = [
        ("AGR", "N × B × V"),
        ("AII", "AGR × M"),
        ("Income Wealth", "AII × K"),
        ("Infrastructure (I)", "(N × B) × 0.05"),
        ("Asset Wealth", "I + L + R + E"),
        ("Total Wealth", "Income Wealth + Asset Wealth"),
    ]

    for name, formula in formulas:
        ws[f'E{row}'] = name
        ws[f'E{row}'].font = Font(size=9, color="6B7280")
        ws[f'F{row}'] = formula
        ws[f'F{row}'].font = Font(size=9, color="6B7280")
        row += 1

    # =========================================
    # Apply background to all cells
    # =========================================
    for r in range(1, row + 5):
        for c in range(1, 8):
            cell = ws.cell(row=r, column=c)
            if cell.fill.start_color.index == '00000000' or cell.fill.start_color.index is None:
                cell.fill = PatternFill(start_color="111827", end_color="111827", fill_type="solid")

    # =========================================
    # CREATE COMPARISON TABLE TAB
    # =========================================
    ws2 = wb.create_sheet(title="Comparison Table")

    # Define number of ruler columns (can add more by copying formulas)
    num_rulers = 20

    # Styles for the comparison sheet
    header_fill_dark = PatternFill(start_color="1F2937", end_color="1F2937", fill_type="solid")
    input_section_fill = PatternFill(start_color="374151", end_color="374151", fill_type="solid")
    income_section_fill = PatternFill(start_color="1E3A5F", end_color="1E3A5F", fill_type="solid")
    asset_section_fill = PatternFill(start_color="14532D", end_color="14532D", fill_type="solid")
    total_section_fill = PatternFill(start_color="78350F", end_color="78350F", fill_type="solid")
    cfo_section_fill = PatternFill(start_color="4C1D95", end_color="4C1D95", fill_type="solid")

    # Set column widths
    ws2.column_dimensions['A'].width = 5
    ws2.column_dimensions['B'].width = 35
    for i in range(num_rulers):
        col_letter = get_column_letter(i + 3)  # Start from column C
        ws2.column_dimensions[col_letter].width = 18

    # Title
    ws2.merge_cells('B2:L2')
    ws2['B2'] = "SAVE Comparison Table - Enter rulers in columns, results auto-calculate"
    ws2['B2'].font = Font(bold=True, size=14, color="F59E0B")
    ws2['B2'].fill = header_fill_dark

    # Build the row structure
    row = 4

    # Helper to add a row with label and formulas
    def add_row(label, row_type, formula_template=None, number_format='#,##0', is_input=False, section_fill=None):
        nonlocal row

        # Row number label
        ws2[f'A{row}'] = row - 3
        ws2[f'A{row}'].font = Font(size=9, color="6B7280")
        ws2[f'A{row}'].fill = header_fill_dark

        # Label
        ws2[f'B{row}'] = label
        if row_type == 'header':
            ws2[f'B{row}'].font = Font(bold=True, size=11, color="F59E0B")
        elif row_type == 'section':
            ws2[f'B{row}'].font = Font(bold=True, size=10, color="FFFFFF")
        elif row_type == 'total':
            ws2[f'B{row}'].font = Font(bold=True, size=11, color="F59E0B")
        else:
            ws2[f'B{row}'].font = Font(size=10, color="D1D5DB")

        if section_fill:
            ws2[f'B{row}'].fill = section_fill
        else:
            ws2[f'B{row}'].fill = header_fill_dark

        # Data columns
        for i in range(num_rulers):
            col = get_column_letter(i + 3)
            cell = ws2[f'{col}{row}']

            if row_type == 'header' or row_type == 'section':
                cell.fill = section_fill if section_fill else header_fill_dark
            elif is_input:
                cell.fill = input_section_fill
                cell.border = thin_border
            elif formula_template:
                # Apply formula
                cell.value = formula_template.replace('COL', col)
                if section_fill:
                    cell.fill = section_fill

            cell.font = Font(size=10, color="FFFFFF")
            if row_type == 'total':
                cell.font = Font(bold=True, size=11, color="F59E0B")
            cell.number_format = number_format
            cell.alignment = Alignment(horizontal='right')

        current_row = row
        row += 1
        return current_row

    # =========================================
    # INPUT SECTION
    # =========================================
    add_row("INPUT PARAMETERS", 'header', section_fill=header_fill_dark)

    ruler_row = add_row("Ruler/Empire Name", 'input', is_input=True, number_format='@')
    year_row = add_row("Year", 'input', is_input=True, number_format='0')

    row += 1  # spacer
    add_row("Income Parameters", 'section', section_fill=income_section_fill)
    pop_row = add_row("Population (N)", 'input', is_input=True, number_format='#,##0')
    base_row = add_row("Base Output (B) oz/person/yr", 'input', is_input=True, number_format='0.00')
    vel_row = add_row("Velocity (V)", 'input', is_input=True, number_format='0.0')
    margin_row = add_row("Extraction Margin (M)", 'input', is_input=True, number_format='0.00')
    cap_row = add_row("Capitalization Multiple (K)", 'input', is_input=True, number_format='0')

    row += 1  # spacer
    add_row("Asset Parameters", 'section', section_fill=asset_section_fill)
    treasury_row = add_row("Liquid Treasury (L) oz", 'input', is_input=True, number_format='#,##0')
    realestate_row = add_row("Imperial Real Estate (R) oz", 'input', is_input=True, number_format='#,##0')
    extragains_row = add_row("Extraordinary Gains (E) oz", 'input', is_input=True, number_format='#,##0')

    row += 1  # spacer
    add_row("Settings", 'section', section_fill=header_fill_dark)
    goldprice_row = add_row("Gold Price ($/oz)", 'input', is_input=True, number_format='#,##0')

    # =========================================
    # OUTPUT SECTION - INCOME VALUATION
    # =========================================
    row += 1  # spacer
    add_row("INCOME VALUATION", 'header', section_fill=income_section_fill)

    agr_row = add_row("Annual Gross Revenue (AGR)", 'calc',
                      f'=IF(COL{pop_row}>0,COL{pop_row}*COL{base_row}*COL{vel_row},"")',
                      number_format='#,##0', section_fill=income_section_fill)

    aii_row = add_row("Annual Imperial Income (AII)", 'calc',
                      f'=IF(COL{agr_row}<>"",COL{agr_row}*COL{margin_row},"")',
                      number_format='#,##0', section_fill=income_section_fill)

    income_wealth_row = add_row("Income Wealth (AII × K)", 'total',
                                f'=IF(COL{aii_row}<>"",COL{aii_row}*COL{cap_row},"")',
                                number_format='#,##0', section_fill=income_section_fill)

    # =========================================
    # OUTPUT SECTION - ASSET VALUATION
    # =========================================
    row += 1  # spacer
    add_row("ASSET VALUATION", 'header', section_fill=asset_section_fill)

    infra_row = add_row("Infrastructure Floor (I)", 'calc',
                        f'=IF(COL{pop_row}>0,(COL{pop_row}*COL{base_row})*0.05,"")',
                        number_format='#,##0', section_fill=asset_section_fill)

    # Display asset inputs again for reference
    add_row("+ Liquid Treasury (L)", 'calc',
            f'=IF(COL{treasury_row}<>"",COL{treasury_row},"")',
            number_format='#,##0', section_fill=asset_section_fill)

    add_row("+ Imperial Real Estate (R)", 'calc',
            f'=IF(COL{realestate_row}<>"",COL{realestate_row},"")',
            number_format='#,##0', section_fill=asset_section_fill)

    add_row("+ Extraordinary Gains (E)", 'calc',
            f'=IF(COL{extragains_row}<>"",COL{extragains_row},"")',
            number_format='#,##0', section_fill=asset_section_fill)

    asset_wealth_row = add_row("Asset Wealth (I+L+R+E)", 'total',
                               f'=IF(COL{infra_row}<>"",COL{infra_row}+COL{treasury_row}+COL{realestate_row}+COL{extragains_row},"")',
                               number_format='#,##0', section_fill=asset_section_fill)

    # =========================================
    # TOTAL WEALTH
    # =========================================
    row += 1  # spacer
    add_row("TOTAL WEALTH", 'header', section_fill=total_section_fill)

    total_wealth_row = add_row("Total Real Wealth (oz)", 'total',
                               f'=IF(COL{income_wealth_row}<>"",COL{income_wealth_row}+COL{asset_wealth_row},"")',
                               number_format='#,##0', section_fill=total_section_fill)

    add_row("Total Wealth (Billions oz)", 'total',
            f'=IF(COL{total_wealth_row}<>"",COL{total_wealth_row}/1000000000,"")',
            number_format='0.00" B"', section_fill=total_section_fill)

    nominal_row = add_row("Nominal Value (USD)", 'total',
                          f'=IF(AND(COL{total_wealth_row}<>"",COL{goldprice_row}>0),COL{total_wealth_row}*COL{goldprice_row},"")',
                          number_format='$#,##0', section_fill=total_section_fill)

    add_row("Nominal Value (Trillions)", 'total',
            f'=IF(COL{nominal_row}<>"",COL{nominal_row}/1000000000000,"")',
            number_format='$0.00" T"', section_fill=total_section_fill)

    # =========================================
    # CFO METRICS
    # =========================================
    row += 1  # spacer
    add_row("CFO METRICS", 'header', section_fill=cfo_section_fill)

    add_row("Income-to-Asset Ratio", 'calc',
            f'=IF(AND(COL{income_wealth_row}<>"",COL{asset_wealth_row}>0),COL{income_wealth_row}/COL{asset_wealth_row},"")',
            number_format='0.00" x"', section_fill=cfo_section_fill)

    add_row("Extraction Efficiency", 'calc',
            f'=IF(COL{margin_row}<>"",COL{margin_row},"")',
            number_format='0.0%', section_fill=cfo_section_fill)

    add_row("Per Capita Wealth (oz)", 'calc',
            f'=IF(AND(COL{total_wealth_row}<>"",COL{pop_row}>0),COL{total_wealth_row}/COL{pop_row},"")',
            number_format='0.00', section_fill=cfo_section_fill)

    add_row("Annual Yield", 'calc',
            f'=IF(AND(COL{aii_row}<>"",COL{total_wealth_row}>0),COL{aii_row}/COL{total_wealth_row},"")',
            number_format='0.00%', section_fill=cfo_section_fill)

    add_row("Income Wealth %", 'calc',
            f'=IF(AND(COL{income_wealth_row}<>"",COL{total_wealth_row}>0),COL{income_wealth_row}/COL{total_wealth_row},"")',
            number_format='0.0%', section_fill=cfo_section_fill)

    add_row("Asset Wealth %", 'calc',
            f'=IF(AND(COL{asset_wealth_row}<>"",COL{total_wealth_row}>0),COL{asset_wealth_row}/COL{total_wealth_row},"")',
            number_format='0.0%', section_fill=cfo_section_fill)

    # =========================================
    # WEALTH COMPOSITION BREAKDOWN
    # =========================================
    row += 1  # spacer
    add_row("WEALTH COMPOSITION %", 'header', section_fill=header_fill_dark)

    add_row("Income Wealth %", 'calc',
            f'=IF(COL{total_wealth_row}>0,COL{income_wealth_row}/COL{total_wealth_row},"")',
            number_format='0.0%')

    add_row("Infrastructure %", 'calc',
            f'=IF(COL{total_wealth_row}>0,COL{infra_row}/COL{total_wealth_row},"")',
            number_format='0.0%')

    add_row("Liquid Treasury %", 'calc',
            f'=IF(COL{total_wealth_row}>0,COL{treasury_row}/COL{total_wealth_row},"")',
            number_format='0.0%')

    add_row("Real Estate %", 'calc',
            f'=IF(COL{total_wealth_row}>0,COL{realestate_row}/COL{total_wealth_row},"")',
            number_format='0.0%')

    add_row("Extraordinary Gains %", 'calc',
            f'=IF(COL{total_wealth_row}>0,COL{extragains_row}/COL{total_wealth_row},"")',
            number_format='0.0%')

    # Apply dark background to all cells
    for r in range(1, row + 3):
        for c in range(1, num_rulers + 4):
            cell = ws2.cell(row=r, column=c)
            if cell.fill.start_color.index == '00000000' or cell.fill.start_color.index is None:
                cell.fill = PatternFill(start_color="111827", end_color="111827", fill_type="solid")

    # Add column headers (Ruler 1, Ruler 2, etc.)
    for i in range(num_rulers):
        col = get_column_letter(i + 3)
        ws2[f'{col}3'] = f'Ruler {i + 1}'
        ws2[f'{col}3'].font = Font(bold=True, size=10, color="F59E0B")
        ws2[f'{col}3'].fill = header_fill_dark
        ws2[f'{col}3'].alignment = Alignment(horizontal='center')

    # Freeze panes - freeze column A, B and row 3
    ws2.freeze_panes = 'C4'

    # Add sample data for first ruler
    ws2['C5'] = "Akbar the Great (Mughal Empire)"
    ws2['C6'] = 1600
    ws2['C8'] = 110000000
    ws2['C9'] = 0.75
    ws2['C10'] = 4.5
    ws2['C11'] = 0.10
    ws2['C12'] = 20
    ws2['C14'] = 50000000
    ws2['C15'] = 10000000
    ws2['C16'] = 5000000
    ws2['C18'] = 2900

    # Add second sample ruler
    ws2['D5'] = "Mansa Musa I (Mali Empire)"
    ws2['D6'] = 1324
    ws2['D8'] = 20000000
    ws2['D9'] = 0.8
    ws2['D10'] = 4.0
    ws2['D11'] = 0.15
    ws2['D12'] = 20
    ws2['D14'] = 16000000
    ws2['D15'] = 0
    ws2['D16'] = 0
    ws2['D18'] = 2900

    # Save the workbook
    wb.save(filename)
    print(f"Excel model saved to: {filename}")
    return filename

if __name__ == "__main__":
    create_save_model("/home/markly2/claude_code/wealth_model/SAVE_Model.xlsx")
