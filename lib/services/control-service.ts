import { db } from "@/lib/db";

const seedControls = [
  ["5.1", "Organizational", "Policies for information security"],
  ["5.2", "Organizational", "Information security roles and responsibilities"],
  ["5.3", "Organizational", "Segregation of duties"],
  ["5.4", "Organizational", "Management responsibilities"],
  ["5.5", "Organizational", "Contact with authorities"],
  ["5.6", "Organizational", "Contact with special interest groups"],
  ["5.7", "Organizational", "Threat intelligence"],
  ["5.8", "Organizational", "Information security in project management"],
  ["5.9", "Organizational", "Inventory of information and assets"],
  ["5.10", "Organizational", "Acceptable use of information and assets"],
  ["5.11", "Organizational", "Return of assets"],
  ["5.12", "Organizational", "Classification of information"],
  ["5.13", "Organizational", "Labelling of information"],
  ["5.14", "Organizational", "Information transfer"],
  ["5.15", "Organizational", "Access control"],
  ["5.16", "Organizational", "Identity management"],
  ["5.17", "Organizational", "Authentication information"],
  ["5.18", "Organizational", "Access rights"],
  ["5.19", "Supplier", "Information security in supplier relationships"],
  ["5.20", "Supplier", "Addressing information security in supplier agreements"],
  ["5.21", "Supplier", "ICT supply chain"],
  ["5.22", "Supplier", "Monitoring supplier services"],
  ["5.23", "Supplier", "Information security for cloud services"],
  ["5.24", "Incident", "Information security incident management planning"],
  ["5.25", "Incident", "Assessment and decision on information security events"],
];

export async function seedIsoControls(orgId: string) {
  await db.control.createMany({
    data: seedControls.map(([id, domain, name]) => ({
      id: `${orgId}-${id}`,
      orgId,
      domain,
      name,
      guidance: "Review applicability and implementation guidance.",
      status: "Not Started",
    })),
    skipDuplicates: true,
  });
}
