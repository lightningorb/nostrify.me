export function create_table(tableName: string, ...args: [string, string][]) {
	return `CREATE TABLE ${tableName} (${args.map(([name, type]) => `${name} ${type}`).join(', ')});`;
}
