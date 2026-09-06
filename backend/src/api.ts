import { connectDB, seedSolarCatalog } from "./db";
import { LeadModel } from "./models/Lead";
import { AdminModel } from "./models/Admin";
import { SolarCompanyModel } from "./models/SolarCompany";
import { SolarPackageModel } from "./models/SolarPackage";
import { ProjectModel } from "./models/Project";
import { DealerModel } from "./models/Dealer";
import { TechnicianModel } from "./models/Technician";
import { ComplaintModel } from "./models/Complaint";
import { InstallationModel } from "./models/Installation";
import { getNextSequence } from "./models/Counter";
import {
  createLeadSchema,
  updateLeadSchema,
  loginSchema,
  createCompanySchema,
  updateCompanySchema,
  createPackageSchema,
  updatePackageSchema,
  quickMatrixUpdateSchema,
  addPaymentTransactionSchema,
  addProjectDocumentSchema,
  addFollowUpSchema,
  addProjectIssueSchema,
  createDealerSchema,
  updateDealerSchema,
  createComplaintSchema,
  trackComplaintSchema,
  updateComplaintSchema,
  createTechnicianSchema,
  updateTechnicianSchema,
  createInstallationSchema,
  updateInstallationSchema,
  slugify,
} from "./validations";
import {
  signToken,
  getAuthenticatedAdmin,
  createAuthCookieHeader,
  createClearAuthCookieHeader,
} from "./auth";
import bcrypt from "bcryptjs";
import { ZodError } from "zod";

function jsonResponse(data: unknown, status = 200, headers: HeadersInit = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
}

function errorResponse(message: string, status = 400, details?: unknown): Response {
  return jsonResponse(
    {
      success: false,
      message,
      details,
    },
    status
  );
}

export async function handleApiRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/$/, "");
  const method = request.method.toUpperCase();

  // Handle CORS Preflight
  if (method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": request.headers.get("origin") || "*",
        "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
      },
    });
  }

  try {
    // ----------------------------------------------------
    // 1. PUBLIC LEAD SUBMISSION: POST /api/leads
    // ----------------------------------------------------
    if (path === "/api/leads" && method === "POST") {
      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return errorResponse("Invalid JSON payload", 400);
      }

      const parseResult = createLeadSchema.safeParse(body);
      if (!parseResult.success) {
        const fieldErrors: Record<string, string> = {};
        parseResult.error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        return errorResponse("Validation failed", 422, fieldErrors);
      }

      const validData = parseResult.data;

      await connectDB();

      // Check for duplicate submission within the last 3 minutes
      const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000);
      const recentDuplicate = await LeadModel.findOne({
        phone: validData.phone,
        city: validData.city,
        createdAt: { $gte: threeMinutesAgo },
      });

      if (recentDuplicate) {
        return jsonResponse(
          {
            success: true,
            message: "We have already received your request! Our representative will contact you soon.",
            data: recentDuplicate,
            enquiryId: recentDuplicate.enquiryId || "",
          },
          200
        );
      }

      // Generate sequential Enquiry ID (e.g. MS-ENQ-2026-000001)
      const enquiryId = await getNextSequence("enquiry");

      let dealerName = validData.dealerName || "";
      if (validData.dealerId && !dealerName) {
        const d = await DealerModel.findOne({
          $or: [
            { dealerId: validData.dealerId },
            { _id: validData.dealerId.match(/^[0-9a-fA-F]{24}$/) ? validData.dealerId : undefined },
          ],
        }).lean();
        if (d) dealerName = d.dealerName;
      }

      const newLead = await LeadModel.create({
        ...validData,
        dealerName,
        enquiryId,
        status: "NEW",
      });

      return jsonResponse(
        {
          success: true,
          message: "Thank you! Your solar inquiry has been received. Our team will contact you shortly.",
          data: newLead,
          enquiryId: newLead.enquiryId,
        },
        201
      );
    }

    // ----------------------------------------------------
    // 2. PUBLIC SOLAR CATALOG: COMPANIES & PACKAGES
    // ----------------------------------------------------

    // GET /api/companies (Public)
    if (path === "/api/companies" && method === "GET") {
      await connectDB();
      await seedSolarCatalog();
      const all = url.searchParams.get("all") === "true";
      const filter = all ? {} : { active: true };
      const companies = await SolarCompanyModel.find(filter).sort({ order: 1, name: 1 });
      return jsonResponse({ success: true, companies });
    }

    // GET /api/packages (Public - with 1-20 KW capacity & company filtering)
    if (path === "/api/packages" && method === "GET") {
      await connectDB();
      const capacityParam = url.searchParams.get("capacity");
      const companyParam = url.searchParams.get("company");
      const availableOnly = url.searchParams.get("availableOnly") === "true";

      const query: Record<string, unknown> = { active: true };

      if (capacityParam && capacityParam !== "ALL") {
        const cap = parseInt(capacityParam, 10);
        if (!isNaN(cap) && cap >= 1 && cap <= 20) {
          query.capacityKW = cap;
        }
      }

      if (companyParam && companyParam !== "ALL") {
        query.$or = [{ companySlug: companyParam }, { companyName: companyParam }];
      }

      if (availableOnly) {
        query.available = true;
      }

      const packages = await SolarPackageModel.find(query).sort({ capacityKW: 1, sellingPrice: 1 });
      return jsonResponse({ success: true, packages });
    }

    // GET single package: /api/packages/:id
    const singlePackageMatch = path.match(/^\/api\/packages\/([a-zA-Z0-9_-]+)$/);
    if (singlePackageMatch && method === "GET") {
      await connectDB();
      const pkg = await SolarPackageModel.findById(singlePackageMatch[1]);
      if (!pkg) return errorResponse("Solar package not found", 404);
      return jsonResponse({ success: true, package: pkg });
    }

    // ----------------------------------------------------
    // 2B. PUBLIC GALLERY / INSTALLATIONS
    // ----------------------------------------------------

    // GET /api/installations (Public Showcase)
    if (path === "/api/installations" && method === "GET") {
      await connectDB();
      const city = url.searchParams.get("city");
      const company = url.searchParams.get("company");
      const query: Record<string, unknown> = { active: true };

      if (city && city !== "ALL") query.city = { $regex: city, $options: "i" };
      if (company && company !== "ALL") query.companyName = company;

      let installations = await InstallationModel.find(query).sort({ featured: -1, createdAt: -1 });

      // Seed initial sample showcase installations if empty
      if (installations.length === 0) {
        const seedInstallations = [
          {
            title: "5 KW Residential Rooftop Installation",
            customerName: "Smt. Shanti Devi",
            location: "Paniyara, Maharajganj",
            city: "Maharajganj",
            companyName: "Tata Power Solar",
            capacityKW: 5,
            installationDate: "2026-01-15",
            description: "High-efficiency bifacial Mono PERC panels with smart grid-tied inverter under PM Surya Ghar Yojana.",
            images: ["/gallery-1.jpg"],
            featured: true,
            active: true,
            technicianName: "Ramesh Sharma",
            installationStatus: "COMPLETED",
          },
          {
            title: "10 KW Commercial Building Solar Setup",
            customerName: "Kisan Sewa Kendra",
            location: "Civil Lines, Gorakhpur",
            city: "Gorakhpur",
            companyName: "Adani Solar",
            capacityKW: 10,
            installationDate: "2026-02-10",
            description: "Custom heavy-duty elevated structure ensuring optimal sunlight capture and zero roof obstruction.",
            images: ["/gallery-2.jpg"],
            featured: true,
            active: true,
            technicianName: "Amit Kumar",
            installationStatus: "COMPLETED",
          },
          {
            title: "3 KW Domestic Rooftop System",
            customerName: "Shri Rajesh Verma",
            location: "Golghar, Gorakhpur",
            city: "Gorakhpur",
            companyName: "Waaree Solar",
            capacityKW: 3,
            installationDate: "2026-02-28",
            description: "Compact 3 KW on-grid system powering household loads and supplying surplus units through net metering.",
            images: ["/gallery-3.jpg"],
            featured: false,
            active: true,
            technicianName: "Ramesh Sharma",
            installationStatus: "COMPLETED",
          },
        ];
        try {
          await InstallationModel.insertMany(seedInstallations);
          installations = await InstallationModel.find(query).sort({ featured: -1, createdAt: -1 });
        } catch {
          // ignore duplicate seed race
        }
      }

      return jsonResponse({ success: true, installations });
    }

    // ----------------------------------------------------
    // 2C. PUBLIC COMPLAINTS & CUSTOMER SUPPORT
    // ----------------------------------------------------

    // POST /api/complaints (Public Registration)
    if (path === "/api/complaints" && method === "POST") {
      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return errorResponse("Invalid JSON payload", 400);
      }

      const parseResult = createComplaintSchema.safeParse(body);
      if (!parseResult.success) {
        const fieldErrors: Record<string, string> = {};
        parseResult.error.errors.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0].toString()] = err.message;
        });
        return errorResponse("Validation failed", 422, fieldErrors);
      }

      const validData = parseResult.data;
      await connectDB();

      const complaintId = await getNextSequence("complaint");

      const newComplaint = await ComplaintModel.create({
        ...validData,
        complaintId,
        status: "RECEIVED",
        priority: "MEDIUM",
        timeline: [
          {
            id: Date.now().toString(),
            status: "RECEIVED",
            title: "Complaint Registered",
            date: new Date().toISOString().split("T")[0],
            time: new Date().toLocaleTimeString(),
            user: "Customer Portal",
            notes: `Service request received for category: ${validData.category}. Ticket ID: ${complaintId}`,
          },
        ],
      });

      return jsonResponse(
        {
          success: true,
          message: `Your complaint has been registered successfully! Ticket ID: ${complaintId}. Please save this ID to track your status.`,
          complaint: newComplaint,
          complaintId,
        },
        201
      );
    }

    // POST /api/complaints/track (Public Tracking: Complaint ID + Mobile)
    if (path === "/api/complaints/track" && method === "POST") {
      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return errorResponse("Invalid JSON payload", 400);
      }

      const parseResult = trackComplaintSchema.safeParse(body);
      if (!parseResult.success) {
        return errorResponse("Please provide both Complaint ID and registered 10-digit mobile number", 422);
      }

      const { complaintId, mobile } = parseResult.data;
      await connectDB();

      const complaint = await ComplaintModel.findOne({
        complaintId: { $regex: new RegExp(`^${complaintId}$`, "i") },
      });

      if (!complaint) {
        return errorResponse(`No complaint found with ID "${complaintId}". Please check and try again.`, 404);
      }

      // Strict privacy check: mobile must match the registered mobile of this complaint
      const cleanInputPhone = mobile.replace(/[^0-9]/g, "").slice(-10);
      const cleanRecordPhone = complaint.mobile.replace(/[^0-9]/g, "").slice(-10);

      if (cleanInputPhone !== cleanRecordPhone) {
        return errorResponse(
          "The mobile number provided does not match our records for this complaint. For security reasons, please provide your registered phone number.",
          403
        );
      }

      return jsonResponse({
        success: true,
        complaint: {
          complaintId: complaint.complaintId,
          customerName: complaint.customerName,
          category: complaint.category,
          description: complaint.description,
          status: complaint.status,
          priority: complaint.priority,
          assignedTechnicianName: complaint.assignedTechnicianName || "Pending Assignment",
          assignedDate: complaint.assignedDate,
          visitDate: complaint.visitDate,
          resolution: complaint.resolution,
          resolutionDate: complaint.resolutionDate,
          timeline: complaint.timeline,
          createdAt: complaint.createdAt,
          updatedAt: complaint.updatedAt,
        },
      });
    }

    // ----------------------------------------------------
    // 3. ADMIN AUTHENTICATION ROUTES
    // ----------------------------------------------------


    // POST /api/auth/login
    if (path === "/api/auth/login" && method === "POST") {
      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return errorResponse("Invalid JSON payload", 400);
      }

      const parseResult = loginSchema.safeParse(body);
      if (!parseResult.success) {
        return errorResponse("Invalid email or password", 422, parseResult.error.flatten());
      }

      const { email, password } = parseResult.data;

      await connectDB();
      const admin = await AdminModel.findOne({ email });
      if (!admin) {
        return errorResponse("Invalid credentials", 401);
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return errorResponse("Invalid credentials", 401);
      }

      const token = signToken(admin);

      const cookieHeader = createAuthCookieHeader(token);

      return jsonResponse(
        {
          success: true,
          message: "Login successful",
          admin: {
            id: (admin._id as any).toString(),
            name: admin.name,
            email: admin.email,
            role: admin.role,
          },
          token,
        },
        200,
        {
          "Set-Cookie": cookieHeader,
        }
      );
    }

    // POST /api/auth/logout
    if (path === "/api/auth/logout" && method === "POST") {
      const clearCookie = createClearAuthCookieHeader();
      return jsonResponse(
        {
          success: true,
          message: "Logged out successfully",
        },
        200,
        {
          "Set-Cookie": clearCookie,
        }
      );
    }

    // GET /api/auth/me
    if (path === "/api/auth/me" && method === "GET") {
      const admin = await getAuthenticatedAdmin(request);
      if (!admin) {
        return errorResponse("Unauthorized", 401);
      }

      return jsonResponse({
        success: true,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      });
    }

    // GET /api/dealers/active (Public list for referral dropdowns)
    if (path === "/api/dealers/active" && method === "GET") {
      await connectDB();
      const activeDealers = await DealerModel.find(
        { active: true },
        { dealerId: 1, dealerName: 1, contactPerson: 1, mobile: 1, city: 1 }
      )
        .sort({ dealerName: 1 })
        .lean();

      return jsonResponse({
        success: true,
        dealers: activeDealers,
      });
    }

    // ----------------------------------------------------
    // 4. ADMIN PROTECTED ROUTES - REQUIRES AUTH
    // ----------------------------------------------------

    const currentAdmin = await getAuthenticatedAdmin(request);
    if (!currentAdmin) {
      return errorResponse("Unauthorized. Please log in to access the admin portal.", 401);
    }

    // GET /api/dashboard/stats
    if (path === "/api/dashboard/stats" && method === "GET") {
      await connectDB();

      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const [
        totalLeads,
        newLeads,
        contactedLeads,
        inProgressLeads,
        convertedLeads,
        closedLeads,
        todayLeads,
        totalCompanies,
        totalPackages,
        recentLeads,
        totalProjects,
        totalInstalled,
        installationPending,
        meterPending,
        meterConfigured,
        loanPending,
        loanApproved,
        loanDisbursed,
        totalOpenIssues,
        totalTechnicians,
        availableTechnicians,
        totalComplaints,
        openComplaints,
        resolvedComplaints,
        availableProducts,
        outOfStockProducts,
        totalInstallations,
      ] = await Promise.all([
        LeadModel.countDocuments(),
        LeadModel.countDocuments({ status: "NEW" }),
        LeadModel.countDocuments({ status: { $in: ["CONTACTED", "RECEIVED", "TECHNICAL_ASSIGNED"] } }),
        LeadModel.countDocuments({ status: { $in: ["IN_PROGRESS", "SITE_SURVEY", "QUOTATION_SENT"] } }),
        LeadModel.countDocuments({ status: "CONVERTED" }),
        LeadModel.countDocuments({ status: "CLOSED" }),
        LeadModel.countDocuments({ createdAt: { $gte: startOfToday } }),
        SolarCompanyModel.countDocuments({ active: true }),
        SolarPackageModel.countDocuments({ active: true }),
        LeadModel.find().sort({ createdAt: -1 }).limit(6),
        ProjectModel.countDocuments(),
        ProjectModel.countDocuments({ "solarInstallation.installationStatus": "COMPLETED" }),
        ProjectModel.countDocuments({ "solarInstallation.installationStatus": { $ne: "COMPLETED" } }),
        ProjectModel.countDocuments({ "meterDetails.configStatus": { $in: ["NOT_STARTED", "APPLIED", "PENDING"] } }),
        ProjectModel.countDocuments({ "meterDetails.configStatus": "CONFIGURED" }),
        ProjectModel.countDocuments({ "bankLoan.loanStatus": { $in: ["APPLICATION_PENDING", "DOCUMENT_PENDING", "UNDER_REVIEW"] } }),
        ProjectModel.countDocuments({ "bankLoan.loanStatus": "APPROVED" }),
        ProjectModel.countDocuments({ "bankLoan.loanStatus": { $in: ["PARTIALLY_DISBURSED", "FULLY_DISBURSED"] } }),
        ProjectModel.countDocuments({ "issues.status": { $in: ["OPEN", "IN_PROGRESS", "WAITING"] } }),
        TechnicianModel.countDocuments({ active: true }),
        TechnicianModel.countDocuments({ active: true, availability: "AVAILABLE" }),
        ComplaintModel.countDocuments(),
        ComplaintModel.countDocuments({ status: { $in: ["RECEIVED", "UNDER_REVIEW", "TECHNICIAN_ASSIGNED", "IN_PROGRESS"] } }),
        ComplaintModel.countDocuments({ status: "RESOLVED" }),
        SolarPackageModel.countDocuments({ active: true, available: true }),
        SolarPackageModel.countDocuments({ active: true, available: false }),
        InstallationModel.countDocuments({ active: true }),
      ]);


      // Calculate subsidy metrics
      const allProjects = await ProjectModel.find({}, { subsidyTracking: 1, payments: 1, city: 1, "solarInstallation.companyName": 1, "solarInstallation.capacityKW": 1, projectStatus: 1 }).lean();

      let centralSubsidyExpected = 0;
      let centralSubsidyReceived = 0;
      let stateSubsidyExpected = 0;
      let stateSubsidyReceived = 0;
      let customerPaymentsPending = 0;

      const cityCounts: Record<string, number> = {};
      const companyCounts: Record<string, number> = {};
      const capacityCounts: Record<string, number> = {};
      const statusCounts: Record<string, number> = {};

      allProjects.forEach((p) => {
        if (p.subsidyTracking?.centralSubsidy) {
          centralSubsidyExpected += p.subsidyTracking.centralSubsidy.expectedAmount || 0;
          centralSubsidyReceived += p.subsidyTracking.centralSubsidy.receivedAmount || 0;
        }
        if (p.subsidyTracking?.stateSubsidy) {
          stateSubsidyExpected += p.subsidyTracking.stateSubsidy.expectedAmount || 0;
          stateSubsidyReceived += p.subsidyTracking.stateSubsidy.receivedAmount || 0;
        }
        if (p.payments) {
          customerPaymentsPending += p.payments.amountRemaining || 0;
        }

        const cityKey = p.city || "Other";
        cityCounts[cityKey] = (cityCounts[cityKey] || 0) + 1;

        const compKey = p.solarInstallation?.companyName || "Other";
        companyCounts[compKey] = (companyCounts[compKey] || 0) + 1;

        const capKey = `${p.solarInstallation?.capacityKW || 5} KW`;
        capacityCounts[capKey] = (capacityCounts[capKey] || 0) + 1;

        const stKey = p.projectStatus || "ENQUIRY";
        statusCounts[stKey] = (statusCounts[stKey] || 0) + 1;
      });

      // Dealer Metrics
      const [totalDealers, activeDealers, inactiveDealers] = await Promise.all([
        DealerModel.countDocuments(),
        DealerModel.countDocuments({ active: true }),
        DealerModel.countDocuments({ active: false }),
      ]);

      const unconvertedDealerLeads = await LeadModel.find(
        {
          dealerId: { $exists: true, $ne: "" },
          convertedToProjectId: { $in: ["", null] },
        },
        { dealerId: 1, dealerName: 1 } as any
      ).lean();

      const dealerProjects = await ProjectModel.find(
        {
          dealerId: { $exists: true, $ne: "" },
        },
        { dealerId: 1, dealerName: 1, "solarInstallation.installationStatus": 1 }
      ).lean();

      const totalDealerClients = unconvertedDealerLeads.length + dealerProjects.length;
      const installedDealerClients = dealerProjects.filter(
        (p) => p.solarInstallation?.installationStatus === "COMPLETED"
      ).length;
      const pendingDealerClients = totalDealerClients - installedDealerClients;

      // Top Dealers aggregation
      const dealerAggMap: Record<
        string,
        { dealerId: string; dealerName: string; mobile: string; totalClients: number; installed: number; pending: number }
      > = {};

      const allDealersList = await DealerModel.find().lean();
      allDealersList.forEach((d) => {
        dealerAggMap[d.dealerId] = {
          dealerId: d.dealerId,
          dealerName: d.dealerName,
          mobile: d.mobile,
          totalClients: 0,
          installed: 0,
          pending: 0,
        };
      });

      unconvertedDealerLeads.forEach((l) => {
        const dId = l.dealerId;
        if (dId && dealerAggMap[dId]) {
          dealerAggMap[dId].totalClients += 1;
          dealerAggMap[dId].pending += 1;
        }
      });

      dealerProjects.forEach((p) => {
        const dId = p.dealerId;
        if (dId && dealerAggMap[dId]) {
          dealerAggMap[dId].totalClients += 1;
          if (p.solarInstallation?.installationStatus === "COMPLETED") {
            dealerAggMap[dId].installed += 1;
          } else {
            dealerAggMap[dId].pending += 1;
          }
        }
      });

      const topDealers = Object.values(dealerAggMap)
        .sort((a, b) => b.totalClients - a.totalClients)
        .slice(0, 5);

      return jsonResponse({
        success: true,
        stats: {
          totalLeads,
          newLeads,
          contactedLeads,
          inProgressLeads,
          convertedLeads,
          closedLeads,
          todayLeads,
          totalCompanies,
          totalPackages,
          totalProjects,
          totalInstalled,
          installationPending,
          meterPending,
          meterConfigured,
          loanPending,
          loanApproved,
          loanDisbursed,
          centralSubsidyExpected,
          centralSubsidyReceived,
          centralSubsidyPending: Math.max(0, centralSubsidyExpected - centralSubsidyReceived),
          stateSubsidyExpected,
          stateSubsidyReceived,
          stateSubsidyPending: Math.max(0, stateSubsidyExpected - stateSubsidyReceived),
          customerPaymentsPending,
          totalOpenIssues,
          totalTechnicians,
          availableTechnicians,
          totalComplaints,
          openComplaints,
          resolvedComplaints,
          availableProducts,
          outOfStockProducts,
          totalInstallations,
          totalDealers,
          activeDealers,
          inactiveDealers,
          totalDealerClients,
          installedDealerClients,
          pendingDealerClients,
          topDealers,
          leadsByStatus: {
            New: newLeads,
            Contacted: contactedLeads,
            InProgress: inProgressLeads,
            Converted: convertedLeads,
            Closed: closedLeads,
          },
          cityCounts,
          companyCounts,
          capacityCounts,
          statusCounts,
          recentLeads,
        },
      });
    }

    // ----------------------------------------------------
    // 5. ADMIN LEADS MANAGEMENT & CONVERSION
    // ----------------------------------------------------

    // GET /api/leads (Search, Filter, Pagination)
    if (path === "/api/leads" && method === "GET") {
      await connectDB();

      const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
      const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "10", 10)));
      const search = (url.searchParams.get("search") || "").trim();
      const status = (url.searchParams.get("status") || "").trim();
      const capacity = (url.searchParams.get("capacity") || "").trim();
      const dateFrom = (url.searchParams.get("dateFrom") || "").trim();
      const dateTo = (url.searchParams.get("dateTo") || "").trim();

      const query: Record<string, unknown> = {};

      if (status && status !== "ALL") {
        query.status = status;
      }

      if (capacity && capacity !== "ALL") {
        const capNum = parseInt(capacity, 10);
        if (!isNaN(capNum)) query.requiredCapacityKW = capNum;
      }

      if (dateFrom || dateTo) {
        query.createdAt = {};
        if (dateFrom) (query.createdAt as Record<string, unknown>).$gte = new Date(dateFrom);
        if (dateTo) {
          const toDate = new Date(dateTo);
          toDate.setHours(23, 59, 59, 999);
          (query.createdAt as Record<string, unknown>).$lte = toDate;
        }
      }

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
          { city: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { enquiryId: { $regex: search, $options: "i" } },
          { consumerNumber: { $regex: search, $options: "i" } },
          { interestedCompany: { $regex: search, $options: "i" } },
        ];
      }

      const total = await LeadModel.countDocuments(query);
      const leads = await LeadModel.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      return jsonResponse({
        success: true,
        leads,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        },
      });
    }

    // POST /api/leads/:id/convert (Convert Lead into Customer Project)
    const convertMatch = path.match(/^\/api\/leads\/([a-zA-Z0-9_-]+)\/convert$/);
    if (convertMatch && method === "POST") {
      const leadId = convertMatch[1];
      await connectDB();

      const lead = await LeadModel.findById(leadId);
      if (!lead) return errorResponse("Lead not found", 404);

      // Check if already converted
      if (lead.convertedToProjectId) {
        const existingProj = await ProjectModel.findOne({ projectId: lead.convertedToProjectId });
        if (existingProj) {
          return jsonResponse({
            success: true,
            message: `Lead was already converted to project ${lead.convertedToProjectId}`,
            project: existingProj,
          });
        }
      }

      // Generate sequential Project ID (e.g. MS-PROJ-2026-000001)
      const projectId = await getNextSequence("project");

      const capacityKW = lead.requiredCapacityKW || 5;
      const companyName = lead.interestedCompany || "Tata Power Solar";
      const totalCost = lead.productPrice || capacityKW * 60000;
      const centralSubsidy = capacityKW <= 2 ? capacityKW * 30000 : 78000;
      const stateSubsidy = capacityKW === 1 ? 15000 : 30000;
      const totalSubsidy = centralSubsidy + stateSubsidy;
      const customerContribution = Math.max(0, totalCost - totalSubsidy);

      const newProject = await ProjectModel.create({
        projectId,
        leadId: lead._id,
        enquiryId: lead.enquiryId || `MS-ENQ-${lead._id.toString().slice(-6).toUpperCase()}`,
        enquiryDate: lead.createdAt,
        source: lead.source || "website-enquiry",
        projectStatus: "ENQUIRY",
        dealerId: lead.dealerId || "",
        dealerName: lead.dealerName || "",

        // Personal Details
        customerName: lead.name,
        fatherHusbandName: "",
        mobile: lead.phone,
        alternateMobile: "",
        whatsapp: lead.whatsapp || lead.phone,
        email: lead.email || "",
        aadhaarNumber: "",
        panNumber: "",
        address: lead.address || "",
        city: lead.city,
        district: lead.district || "",
        state: "Uttar Pradesh",
        pincode: lead.pincode || "",

        // DISCOM Details
        discomDetails: {
          discomName: "Purvanchal Vidyut Vitaran Nigam Ltd (PVVNL)",
          consumerName: lead.consumerName || lead.name,
          consumerNumber: lead.consumerNumber || "",
          connectionNumber: lead.connectionNumber || "",
          connectionType: lead.connectionType || "Domestic",
          currentBillAmount: lead.billAmount ? parseFloat(lead.billAmount.replace(/[^0-9.]/g, "")) || 0 : 0,
        },

        // Solar Installation
        solarInstallation: {
          companyName,
          panelBrand: companyName,
          panelModel: "Mono PERC Bifacial",
          panelWattage: 550,
          panelCount: Math.ceil((capacityKW * 1000) / 550),
          capacityKW,
          inverterBrand: `${companyName} Inverter`,
          inverterModel: `${capacityKW}KW-OG-550`,
          structureType: "Hot Dip Galvanized Rooftop Structure",
          batteryIncluded: false,
          installationAddress: lead.address || `${lead.city}, Uttar Pradesh`,
          installationStatus: "NOT_SCHEDULED",
          checklist: {
            panelsInstalled: "PENDING",
            structureInstalled: "PENDING",
            inverterInstalled: "PENDING",
            dcWiringComplete: "PENDING",
            acWiringComplete: "PENDING",
            earthingComplete: "PENDING",
            lightningProtection: "PENDING",
            safetyCheck: "PENDING",
            inverterCommissioned: "PENDING",
            generationTested: "PENDING",
            meterProcessStarted: "PENDING",
            customerHandoverComplete: "PENDING",
          },
        },

        // Payments
        payments: {
          totalProjectCost: totalCost,
          subsidyExpected: totalSubsidy,
          customerContribution,
          downPayment: 0,
          amountPaid: 0,
          amountRemaining: customerContribution,
          paymentStatus: "PENDING",
          transactions: [],
        },

        // Bank Loan
        bankLoan: {
          loanRequired: false,
          loanStatus: "NOT_REQUIRED",
        },

        // Subsidy Tracking
        subsidyTracking: {
          centralSubsidy: {
            applied: false,
            expectedAmount: centralSubsidy,
            receivedAmount: 0,
            status: "NOT_APPLIED",
          },
          stateSubsidy: {
            applied: false,
            expectedAmount: stateSubsidy,
            receivedAmount: 0,
            status: "NOT_APPLIED",
          },
        },

        // Current Follow-up
        currentFollowUp: {
          currentFollowUpWith: "CUSTOMER",
          contactPerson: lead.name,
          phone: lead.phone,
          lastContactDate: new Date().toISOString().split("T")[0],
          currentDiscussion: "Customer converted from website lead. Ready for site document verification.",
        },

        // Timeline History
        timeline: [
          {
            id: Date.now().toString(),
            date: new Date().toISOString().split("T")[0],
            time: new Date().toLocaleTimeString(),
            user: currentAdmin.name || "Admin",
            status: "CONVERTED",
            title: "Lead Converted to Customer Project",
            notes: `Project ${projectId} initiated from Enquiry ${lead.enquiryId || lead._id}. Initial capacity: ${capacityKW} KW (${companyName}).`,
          },
        ],
      });

      // Update lead
      lead.status = "CONVERTED";
      lead.convertedToProjectId = projectId;
      lead.convertedAt = new Date();
      await lead.save();

      return jsonResponse(
        {
          success: true,
          message: `Lead successfully converted to Project ${projectId}!`,
          project: newProject,
        },
        201
      );
    }

    // PATCH /api/leads/:id
    const singleLeadMatch = path.match(/^\/api\/leads\/([a-zA-Z0-9_-]+)$/);
    if (singleLeadMatch && method === "PATCH") {
      const leadId = singleLeadMatch[1];
      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return errorResponse("Invalid JSON", 400);
      }

      const parseResult = updateLeadSchema.safeParse(body);
      if (!parseResult.success) {
        return errorResponse("Validation failed", 422, parseResult.error.flatten());
      }

      await connectDB();
      const updated = await LeadModel.findByIdAndUpdate(
        leadId,
        { $set: parseResult.data },
        { new: true }
      );

      if (!updated) return errorResponse("Lead not found", 404);

      return jsonResponse({
        success: true,
        message: "Lead updated successfully",
        lead: updated,
      });
    }

    // DELETE /api/leads/:id
    if (singleLeadMatch && method === "DELETE") {
      const leadId = singleLeadMatch[1];
      await connectDB();
      const deleted = await LeadModel.findByIdAndDelete(leadId);
      if (!deleted) return errorResponse("Lead not found", 404);

      return jsonResponse({
        success: true,
        message: "Lead deleted successfully",
      });
    }

    // ----------------------------------------------------
    // 6. MASTER CUSTOMER PROJECTS MANAGEMENT
    // ----------------------------------------------------

    // GET /api/projects (Search & Filter)
    if (path === "/api/projects" && method === "GET") {
      await connectDB();

      const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
      const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "15", 10)));
      const search = (url.searchParams.get("search") || "").trim();
      const projectStatus = (url.searchParams.get("projectStatus") || "").trim();
      const installationStatus = (url.searchParams.get("installationStatus") || "").trim();
      const paymentStatus = (url.searchParams.get("paymentStatus") || "").trim();
      const loanStatus = (url.searchParams.get("loanStatus") || "").trim();
      const centralSubsidyStatus = (url.searchParams.get("centralSubsidyStatus") || "").trim();
      const company = (url.searchParams.get("company") || "").trim();
      const capacity = (url.searchParams.get("capacity") || "").trim();
      const city = (url.searchParams.get("city") || "").trim();

      const query: Record<string, unknown> = {};

      if (projectStatus && projectStatus !== "ALL") query.projectStatus = projectStatus;
      if (installationStatus && installationStatus !== "ALL") query["solarInstallation.installationStatus"] = installationStatus;
      if (paymentStatus && paymentStatus !== "ALL") query["payments.paymentStatus"] = paymentStatus;
      if (loanStatus && loanStatus !== "ALL") query["bankLoan.loanStatus"] = loanStatus;
      if (centralSubsidyStatus && centralSubsidyStatus !== "ALL") query["subsidyTracking.centralSubsidy.status"] = centralSubsidyStatus;
      if (company && company !== "ALL") query["solarInstallation.companyName"] = company;
      if (city && city !== "ALL") query.city = { $regex: city, $options: "i" };

      if (capacity && capacity !== "ALL") {
        const capNum = parseInt(capacity, 10);
        if (!isNaN(capNum)) query["solarInstallation.capacityKW"] = capNum;
      }

      if (search) {
        query.$or = [
          { customerName: { $regex: search, $options: "i" } },
          { mobile: { $regex: search, $options: "i" } },
          { projectId: { $regex: search, $options: "i" } },
          { enquiryId: { $regex: search, $options: "i" } },
          { aadhaarNumber: { $regex: search, $options: "i" } },
          { panNumber: { $regex: search, $options: "i" } },
          { "discomDetails.consumerNumber": { $regex: search, $options: "i" } },
          { city: { $regex: search, $options: "i" } },
          { "solarInstallation.technician": { $regex: search, $options: "i" } },
        ];
      }

      const total = await ProjectModel.countDocuments(query);
      const projects = await ProjectModel.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      return jsonResponse({
        success: true,
        projects,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        },
      });
    }

    // POST /api/projects (Create New Solar Project Entry / Past Installation Data)
    if (path === "/api/projects" && method === "POST") {
      await connectDB();
      let body: Record<string, any>;
      try {
        body = await request.json();
      } catch {
        return errorResponse("Invalid JSON", 400);
      }

      if (!body.customerName || !body.mobile) {
        return errorResponse("Customer Name and Mobile Number are required", 422);
      }

      const projectId = await getNextSequence("project");
      const currentAdmin = (await getAuthenticatedAdmin(request)) || { name: "Admin" };

      // Calculate initial payments
      const totalCost = Number(body.payments?.totalProjectCost) || 0;
      const custContrib = Number(body.payments?.customerContribution) || totalCost;
      const initialPaid = Number(body.payments?.amountPaid) || Number(body.payments?.downPayment) || 0;
      const remaining = Math.max(0, custContrib - initialPaid);

      const newProject = new ProjectModel({
        projectId,
        customerName: body.customerName.trim(),
        fatherHusbandName: body.fatherHusbandName || "",
        mobile: body.mobile.trim(),
        alternateMobile: body.alternateMobile || "",
        whatsapp: body.whatsapp || body.mobile.trim(),
        email: body.email || "",
        aadhaarNumber: body.aadhaarNumber || "",
        panNumber: body.panNumber || "",
        address: body.address || "",
        city: body.city || "Paniyara",
        district: body.district || "Maharajganj",
        state: body.state || "Uttar Pradesh",
        pincode: body.pincode || "273303",
        projectStatus: body.projectStatus || "INSTALLATION_COMPLETE",
        source: body.source || "Manual Entry",
        enquiryDate: body.enquiryDate || new Date(),
        dealerId: body.dealerId || "",
        dealerName: body.dealerName || "",
        issues: body.issues || [],

        discomDetails: {
          discomName: body.discomDetails?.discomName || "UPPCL (Purvanchal Vidyut Vitaran Nigam)",
          division: body.discomDetails?.division || "",
          subDivision: body.discomDetails?.subDivision || "",
          officeLocation: body.discomDetails?.officeLocation || "",
          consumerName: body.discomDetails?.consumerName || body.customerName,
          consumerNumber: body.discomDetails?.consumerNumber || "",
          meterNumber: body.discomDetails?.meterNumber || "",
          billNumber: body.discomDetails?.billNumber || "",
          latestBillDate: body.discomDetails?.latestBillDate || "",
          sanctionedLoad: body.discomDetails?.sanctionedLoad || `${body.solarInstallation?.capacityKW || 3} KW`,
        },

        billVerification: {
          nameCorrect: body.billVerification?.nameCorrect || "CORRECT",
          consumerNumberCorrect: body.billVerification?.consumerNumberCorrect || "CORRECT",
          addressCorrect: body.billVerification?.addressCorrect || "CORRECT",
          billNumberCorrect: body.billVerification?.billNumberCorrect || "CORRECT",
          aadhaarDetailsCorrect: body.billVerification?.aadhaarDetailsCorrect || "CORRECT",
          panDetailsCorrect: body.billVerification?.panDetailsCorrect || "CORRECT",
          connectionDetailsCorrect: body.billVerification?.connectionDetailsCorrect || "CORRECT",
          verificationNotes: body.billVerification?.verificationNotes || "",
        },

        nameCorrection: {
          required: Boolean(body.nameCorrection?.required),
          submitted: Boolean(body.nameCorrection?.submitted),
          submissionDate: body.nameCorrection?.submissionDate || "",
          deptOffice: body.nameCorrection?.deptOffice || "",
          status: body.nameCorrection?.status || (body.nameCorrection?.required ? "SUBMITTED" : "NOT_REQUIRED"),
          remarks: body.nameCorrection?.remarks || "",
        },

        meterDetails: {
          existingMeterType: body.meterDetails?.existingMeterType || "Smart Meter",
          meterNumber: body.meterDetails?.meterNumber || body.discomDetails?.meterNumber || "",
          configStatus: body.meterDetails?.configStatus || "CONFIGURED",
          configDate: body.meterDetails?.configDate || new Date().toISOString().split("T")[0],
          panelInstalled: body.meterDetails?.panelInstalled ?? true,
          meterConfigured: body.meterDetails?.meterConfigured ?? true,
          meterWorkingCorrectly: body.meterDetails?.meterWorkingCorrectly ?? true,
          meterReadingCorrect: body.meterDetails?.meterReadingCorrect ?? true,
          solarGenerationShowing: body.meterDetails?.solarGenerationShowing ?? true,
          netMeteringWorking: body.meterDetails?.netMeteringWorking ?? true,
          billCorrectAfterInstallation: body.meterDetails?.billCorrectAfterInstallation ?? true,
          issueDescription: body.meterDetails?.issueDescription || "",
        },

        solarInstallation: {
          companyName: body.solarInstallation?.companyName || "Tata Power Solar",
          panelBrand: body.solarInstallation?.panelBrand || "Mono Perc Half-Cut (Bi-Facial)",
          panelWattage: Number(body.solarInstallation?.panelWattage) || 550,
          panelCount: Number(body.solarInstallation?.panelCount) || (body.solarInstallation?.capacityKW ? Math.ceil(body.solarInstallation.capacityKW * 1000 / 550) : 6),
          capacityKW: Number(body.solarInstallation?.capacityKW) || 3,
          inverterBrand: body.solarInstallation?.inverterBrand || "On-Grid Solar Inverter",
          inverterSerialNumber: body.solarInstallation?.inverterSerialNumber || "",
          structureType: body.solarInstallation?.structureType || "GI Elevated Roof Structure",
          batteryIncluded: Boolean(body.solarInstallation?.batteryIncluded),
          installationStatus: body.solarInstallation?.installationStatus || "COMPLETED",
          installationDate: body.solarInstallation?.installationDate || new Date().toISOString().split("T")[0],
          installationPhotos: body.solarInstallation?.installationPhotos || [],
          checklist: {
            panelsInstalled: "DONE",
            structureInstalled: "DONE",
            inverterInstalled: "DONE",
            dcWiringComplete: "DONE",
            acWiringComplete: "DONE",
            earthingComplete: "DONE",
            lightningProtection: "DONE",
            safetyCheck: "DONE",
            inverterCommissioned: "DONE",
            generationTested: "DONE",
            meterProcessStarted: "DONE",
            customerHandoverComplete: "DONE",
          },
        },

        payments: {
          totalProjectCost: totalCost,
          subsidyExpected: Number(body.payments?.subsidyExpected) || 108000,
          customerContribution: custContrib,
          downPayment: initialPaid,
          amountPaid: initialPaid,
          amountRemaining: remaining,
          paymentStatus: remaining === 0 && initialPaid > 0 ? "PAID" : initialPaid > 0 ? "PARTIAL" : "PENDING",
          transactions: initialPaid > 0 ? [{
            id: Date.now().toString(),
            paymentDate: new Date().toISOString().split("T")[0],
            amount: initialPaid,
            paymentMode: body.payments?.paymentMode || "Bank / Cash",
            receiptNumber: `RCP-${Date.now().toString().slice(-6)}`,
            notes: "Initial payment recorded upon project entry",
            createdAt: new Date().toISOString(),
          }] : [],
        },

        bankLoan: {
          loanRequired: Boolean(body.bankLoan?.loanRequired),
          bankName: body.bankLoan?.bankName || "",
          branchName: body.bankLoan?.branchName || "",
          bankLocation: body.bankLoan?.bankLocation || "",
          loanAppNumber: body.bankLoan?.loanAppNumber || "",
          loanAmountApplied: Number(body.bankLoan?.loanAmountApplied) || 0,
          loanAmountApproved: Number(body.bankLoan?.loanAmountApproved) || 0,
          loanAmountDisbursed: Number(body.bankLoan?.loanAmountDisbursed) || 0,
          nextExpectedPayment: Number(body.bankLoan?.nextExpectedPayment) || 0,
          nextPaymentDate: body.bankLoan?.nextPaymentDate || "",
          remainingBankAmount: Math.max(0, (Number(body.bankLoan?.loanAmountApproved) || 0) - (Number(body.bankLoan?.loanAmountDisbursed) || 0)),
          loanStatus: body.bankLoan?.loanStatus || (body.bankLoan?.loanRequired ? "APPROVED" : "NOT_REQUIRED"),
        },

        subsidyTracking: {
          centralSubsidy: {
            applied: body.subsidyTracking?.centralSubsidy?.applied ?? true,
            appNumber: body.subsidyTracking?.centralSubsidy?.appNumber || "",
            appDate: body.subsidyTracking?.centralSubsidy?.appDate || "",
            expectedAmount: Number(body.subsidyTracking?.centralSubsidy?.expectedAmount) || 78000,
            approvedAmount: Number(body.subsidyTracking?.centralSubsidy?.approvedAmount) || 78000,
            receivedAmount: Number(body.subsidyTracking?.centralSubsidy?.receivedAmount) || 0,
            receivedDate: body.subsidyTracking?.centralSubsidy?.receivedDate || "",
            status: body.subsidyTracking?.centralSubsidy?.status || "UNDER_PROCESS",
          },
          stateSubsidy: {
            applied: body.subsidyTracking?.stateSubsidy?.applied ?? true,
            appNumber: body.subsidyTracking?.stateSubsidy?.appNumber || "",
            appDate: body.subsidyTracking?.stateSubsidy?.appDate || "",
            expectedAmount: Number(body.subsidyTracking?.stateSubsidy?.expectedAmount) || 30000,
            approvedAmount: Number(body.subsidyTracking?.stateSubsidy?.approvedAmount) || 30000,
            receivedAmount: Number(body.subsidyTracking?.stateSubsidy?.receivedAmount) || 0,
            receivedDate: body.subsidyTracking?.stateSubsidy?.receivedDate || "",
            status: body.subsidyTracking?.stateSubsidy?.status || "UNDER_PROCESS",
          },
        },

        currentFollowUp: {
          currentFollowUpWith: body.currentFollowUp?.currentFollowUpWith || "CUSTOMER",
          contactPerson: body.currentFollowUp?.contactPerson || body.customerName,
          phone: body.currentFollowUp?.phone || body.mobile,
          lastContactDate: new Date().toISOString().split("T")[0],
          nextFollowUpDate: body.currentFollowUp?.nextFollowUpDate || "",
          currentDiscussion: body.currentFollowUp?.currentDiscussion || body.currentFollowUp?.discussionNotes || "Project entry recorded in Admin CRM",
        },

        timeline: [{
          id: Date.now().toString(),
          date: new Date().toISOString().split("T")[0],
          time: new Date().toLocaleTimeString(),
          user: currentAdmin.name || "Admin",
          status: body.projectStatus || "INSTALLATION_COMPLETE",
          title: "Solar Installation Project Created in System",
          notes: `Project record created directly via Admin Portal by ${currentAdmin.name || "Admin"}.`,
        }],
      });

      await newProject.save();

      return jsonResponse({
        success: true,
        message: `Solar Project ${newProject.projectId} for "${newProject.customerName}" successfully created!`,
        project: newProject,
      }, 201);
    }

    // Match /api/projects/:id (or sub-actions)
    const projectActionMatch = path.match(/^\/api\/projects\/([a-zA-Z0-9_-]+)(?:\/([a-zA-Z0-9_-]+))?$/);
    if (projectActionMatch) {
      const projectParam = projectActionMatch[1];
      const action = projectActionMatch[2]; // e.g. "payments", "documents", "followups", "issues"
      await connectDB();

      const project = await ProjectModel.findOne({
        $or: [{ projectId: projectParam }, { _id: projectParam.match(/^[0-9a-fA-F]{24}$/) ? projectParam : undefined }],
      });

      if (!project) return errorResponse("Customer project not found", 404);

      // GET /api/projects/:id (Full Master File)
      if (!action && method === "GET") {
        return jsonResponse({ success: true, project });
      }

      // PATCH /api/projects/:id (Update Project fields & subdocuments)
      if (!action && method === "PATCH") {
        let body: Record<string, any>;
        try {
          body = await request.json();
        } catch {
          return errorResponse("Invalid JSON", 400);
        }

        const oldStatus = project.projectStatus;

        // Apply partial updates
        Object.keys(body).forEach((key) => {
          if (key === "_id" || key === "projectId" || key === "createdAt") return;
          if (typeof body[key] === "object" && body[key] !== null && !Array.isArray(body[key])) {
            if ((project as any)[key]) {
              Object.assign((project as any)[key], body[key]);
            } else {
              (project as any)[key] = body[key];
            }
          } else {
            (project as any)[key] = body[key];
          }
        });

        // Recalculate payment balances if payments updated
        if (body.payments || body.payments?.totalProjectCost || body.payments?.customerContribution) {
          const paid = (project.payments.transactions || []).reduce((acc, t) => acc + (t.amount || 0), 0);
          project.payments.amountPaid = paid;
          project.payments.amountRemaining = Math.max(0, (project.payments.customerContribution || 0) - paid);
          if (paid >= (project.payments.customerContribution || 0) && paid > 0) {
            project.payments.paymentStatus = "PAID";
          } else if (paid > 0) {
            project.payments.paymentStatus = "PARTIAL";
          }
        }

        // Recalculate loan balances if bankLoan updated
        if (body.bankLoan) {
          const approved = project.bankLoan.loanAmountApproved || 0;
          const disbursed = project.bankLoan.loanAmountDisbursed || 0;
          project.bankLoan.remainingBankAmount = Math.max(0, approved - disbursed);
        }

        // Add timeline event if status changed
        if (body.projectStatus && body.projectStatus !== oldStatus) {
          project.timeline.push({
            id: Date.now().toString(),
            date: new Date().toISOString().split("T")[0],
            time: new Date().toLocaleTimeString(),
            user: currentAdmin.name || "Admin",
            status: body.projectStatus,
            title: `Status Changed to ${body.projectStatus}`,
            notes: body.statusNotes || `Project lifecycle status progressed from ${oldStatus} to ${body.projectStatus}`,
          });
        }

        await project.save();

        return jsonResponse({
          success: true,
          message: "Project updated successfully",
          project,
        });
      }

      // POST /api/projects/:id/payments (Add Payment Transaction)
      if (action === "payments" && method === "POST") {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return errorResponse("Invalid JSON", 400);
        }

        const parseResult = addPaymentTransactionSchema.safeParse(body);
        if (!parseResult.success) {
          return errorResponse("Validation failed", 422, parseResult.error.flatten());
        }

        const txnData = parseResult.data;
        const newTxn = {
          id: Date.now().toString(),
          ...txnData,
          createdAt: new Date().toISOString(),
        };

        project.payments.transactions.push(newTxn as any);

        // Recalculate amounts
        const totalPaid = project.payments.transactions.reduce((acc, t) => acc + (t.amount || 0), 0);
        project.payments.amountPaid = totalPaid;
        project.payments.amountRemaining = Math.max(0, project.payments.customerContribution - totalPaid);

        if (totalPaid >= project.payments.customerContribution && totalPaid > 0) {
          project.payments.paymentStatus = "PAID";
        } else if (totalPaid > 0) {
          project.payments.paymentStatus = "PARTIAL";
        }

        // Add timeline entry
        project.timeline.push({
          id: Date.now().toString(),
          date: txnData.paymentDate,
          time: new Date().toLocaleTimeString(),
          user: currentAdmin.name || "Admin",
          status: "PAYMENT_RECEIVED",
          title: `Payment Received: ₹${txnData.amount.toLocaleString("en-IN")}`,
          notes: `Payment recorded via ${txnData.paymentMode}. Txn ID: ${txnData.transactionId || "N/A"}. Remaining customer balance: ₹${project.payments.amountRemaining.toLocaleString("en-IN")}`,
        });

        await project.save();

        return jsonResponse({
          success: true,
          message: `Payment of ₹${txnData.amount} recorded!`,
          project,
        });
      }

      // POST /api/projects/:id/documents (Add Document)
      if (action === "documents" && method === "POST") {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return errorResponse("Invalid JSON", 400);
        }

        const parseResult = addProjectDocumentSchema.safeParse(body);
        if (!parseResult.success) {
          return errorResponse("Validation failed", 422, parseResult.error.flatten());
        }

        const docData = parseResult.data;
        const newDoc = {
          id: Date.now().toString(),
          ...docData,
          uploadDate: new Date().toISOString(),
          uploadedBy: currentAdmin.name || "Admin",
        };

        project.documents.push(newDoc as any);

        project.timeline.push({
          id: Date.now().toString(),
          date: new Date().toISOString().split("T")[0],
          time: new Date().toLocaleTimeString(),
          user: currentAdmin.name || "Admin",
          status: "DOCUMENT_UPLOADED",
          title: `Document Uploaded: ${docData.name} (${docData.docType})`,
          notes: docData.notes || `Status set to ${docData.status}`,
        });

        await project.save();

        return jsonResponse({
          success: true,
          message: `Document "${docData.name}" uploaded successfully!`,
          project,
        });
      }

      // POST /api/projects/:id/followups (Add Follow-up Log)
      if (action === "followups" && method === "POST") {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return errorResponse("Invalid JSON", 400);
        }

        const parseResult = addFollowUpSchema.safeParse(body);
        if (!parseResult.success) {
          return errorResponse("Validation failed", 422, parseResult.error.flatten());
        }

        const fData = parseResult.data;
        const newFollowUp = {
          id: Date.now().toString(),
          ...fData,
          loggedBy: currentAdmin.name || "Admin",
        };

        project.followUps.push(newFollowUp as any);

        // Update "Kis se baat chal rahi hai" summary
        project.currentFollowUp = {
          currentFollowUpWith: (fData.party.toUpperCase().replace(/\s+/g, "_") as any) || "CUSTOMER",
          contactPerson: fData.contactPerson || project.customerName,
          phone: (body as any).phone || project.mobile,
          lastContactDate: fData.date,
          nextFollowUpDate: fData.nextFollowUpDate || "",
          currentDiscussion: fData.notes,
        };

        project.timeline.push({
          id: Date.now().toString(),
          date: fData.date,
          time: fData.time || new Date().toLocaleTimeString(),
          user: currentAdmin.name || "Admin",
          status: "FOLLOW_UP",
          title: `Follow-up with ${fData.party} (${fData.contactMethod})`,
          notes: `${fData.notes}. Next follow-up: ${fData.nextFollowUpDate || "N/A"}`,
        });

        await project.save();

        return jsonResponse({
          success: true,
          message: "Follow-up record saved successfully!",
          project,
        });
      }

      // POST /api/projects/:id/issues (Add Issue / Complaint)
      if (action === "issues" && method === "POST") {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return errorResponse("Invalid JSON", 400);
        }

        const parseResult = addProjectIssueSchema.safeParse(body);
        if (!parseResult.success) {
          return errorResponse("Validation failed", 422, parseResult.error.flatten());
        }

        const issueData = parseResult.data;
        const newIssue = {
          id: Date.now().toString(),
          ...issueData,
        };

        project.issues.push(newIssue as any);

        project.timeline.push({
          id: Date.now().toString(),
          date: issueData.dateReported,
          time: new Date().toLocaleTimeString(),
          user: currentAdmin.name || "Admin",
          status: "ISSUE_REPORTED",
          title: `Issue Logged: ${issueData.title} [${issueData.priority}]`,
          notes: issueData.description,
        });

        await project.save();

        return jsonResponse({
          success: true,
          message: "Issue logged successfully!",
          project,
        });
      }

      // DELETE /api/projects/:id
      if (!action && method === "DELETE") {
        await ProjectModel.findByIdAndDelete(project._id);
        return jsonResponse({
          success: true,
          message: `Project ${project.projectId} deleted successfully`,
        });
      }
    }

    // ----------------------------------------------------
    // 7. DEALER / VENDOR MANAGEMENT & PERFORMANCE REPORTS
    // ----------------------------------------------------

    // GET /api/dealers (List dealers with search, status filter, sorting, and dynamic client stats)
    if (path === "/api/dealers" && method === "GET") {
      await connectDB();
      const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
      const limit = Math.max(1, parseInt(url.searchParams.get("limit") || "15", 10));
      const search = (url.searchParams.get("search") || "").trim();
      const statusFilter = (url.searchParams.get("status") || "ALL").toUpperCase();
      const sortBy = url.searchParams.get("sortBy") || "createdAt";
      const sortOrder = url.searchParams.get("sortOrder") === "asc" ? 1 : -1;

      const query: Record<string, unknown> = {};

      if (statusFilter === "ACTIVE") query.active = true;
      if (statusFilter === "INACTIVE") query.active = false;

      if (search) {
        query.$or = [
          { dealerName: { $regex: search, $options: "i" } },
          { contactPerson: { $regex: search, $options: "i" } },
          { mobile: { $regex: search, $options: "i" } },
          { city: { $regex: search, $options: "i" } },
          { district: { $regex: search, $options: "i" } },
          { dealerId: { $regex: search, $options: "i" } },
        ];
      }

      const total = await DealerModel.countDocuments(query);
      const rawDealers = await DealerModel.find(query)
        .sort({ [sortBy]: sortOrder })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      // Retrieve real-time dynamic client statistics for these dealers
      const dealerIds = rawDealers.map((d) => d.dealerId);

      const [leadsForDealers, projectsForDealers] = await Promise.all([
        LeadModel.find(
          {
            dealerId: { $in: dealerIds },
            convertedToProjectId: { $in: ["", null] },
          },
          { dealerId: 1, status: 1 } as any
        ).lean(),
        ProjectModel.find(
          {
            dealerId: { $in: dealerIds },
          },
          {
            dealerId: 1,
            projectStatus: 1,
            "solarInstallation.installationStatus": 1,
            "payments.totalProjectCost": 1,
            "payments.amountPaid": 1,
            "payments.amountRemaining": 1,
          }
        ).lean(),
      ]);

      const dealerStatsMap: Record<
        string,
        { totalClients: number; installedProjects: number; pendingClients: number; totalProjectValue: number }
      > = {};

      dealerIds.forEach((id) => {
        dealerStatsMap[id] = { totalClients: 0, installedProjects: 0, pendingClients: 0, totalProjectValue: 0 };
      });

      leadsForDealers.forEach((l) => {
        if (l.dealerId && dealerStatsMap[l.dealerId]) {
          dealerStatsMap[l.dealerId].totalClients += 1;
          dealerStatsMap[l.dealerId].pendingClients += 1;
        }
      });

      projectsForDealers.forEach((p) => {
        if (p.dealerId && dealerStatsMap[p.dealerId]) {
          dealerStatsMap[p.dealerId].totalClients += 1;
          dealerStatsMap[p.dealerId].totalProjectValue += p.payments?.totalProjectCost || 0;
          if (p.solarInstallation?.installationStatus === "COMPLETED") {
            dealerStatsMap[p.dealerId].installedProjects += 1;
          } else {
            dealerStatsMap[p.dealerId].pendingClients += 1;
          }
        }
      });

      const dealers = rawDealers.map((d) => ({
        ...d,
        id: (d as any)._id?.toString() || (d as any).id,
        totalClients: dealerStatsMap[d.dealerId]?.totalClients || 0,
        installedProjects: dealerStatsMap[d.dealerId]?.installedProjects || 0,
        pendingClients: dealerStatsMap[d.dealerId]?.pendingClients || 0,
        totalProjectValue: dealerStatsMap[d.dealerId]?.totalProjectValue || 0,
      }));

      return jsonResponse({
        success: true,
        dealers,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        },
      });
    }

    // POST /api/dealers (Create new Dealer)
    if (path === "/api/dealers" && method === "POST") {
      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return errorResponse("Invalid JSON payload", 400);
      }

      const parseResult = createDealerSchema.safeParse(body);
      if (!parseResult.success) {
        return errorResponse("Validation failed", 422, parseResult.error.flatten());
      }

      const validData = parseResult.data;
      await connectDB();

      // Check for duplicate mobile
      const existingDealer = await DealerModel.findOne({ mobile: validData.mobile });
      if (existingDealer) {
        return errorResponse(`A dealer with mobile ${validData.mobile} already exists (${existingDealer.dealerId})`, 409);
      }

      const dealerId = await getNextSequence("dealer");

      const newDealer = await DealerModel.create({
        ...validData,
        dealerId,
        registrationDate: validData.registrationDate ? new Date(validData.registrationDate) : new Date(),
      });

      return jsonResponse(
        {
          success: true,
          message: `Dealer ${newDealer.dealerName} registered successfully with ID ${dealerId}!`,
          dealer: newDealer,
        },
        201
      );
    }

    // GET /api/reports/dealer-performance
    if (path === "/api/reports/dealer-performance" && method === "GET") {
      await connectDB();
      const range = (url.searchParams.get("range") || "month").toLowerCase();
      const customFrom = url.searchParams.get("from");
      const customTo = url.searchParams.get("to");

      const now = new Date();
      let startDate: Date;

      if (range === "today") {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      } else if (range === "week") {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (range === "year") {
        startDate = new Date(now.getFullYear(), 0, 1);
      } else if (range === "custom" && customFrom) {
        startDate = new Date(customFrom);
      } else {
        // default: month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }

      const dateQuery: Record<string, unknown> = { createdAt: { $gte: startDate } };
      if (range === "custom" && customTo) {
        (dateQuery.createdAt as Record<string, unknown>).$lte = new Date(customTo);
      }

      const allDealers = await DealerModel.find().sort({ dealerName: 1 }).lean();
      const dealerIds = allDealers.map((d) => d.dealerId);

      const [leadsInRange, projectsInRange] = await Promise.all([
        LeadModel.find({
          dealerId: { $in: dealerIds },
          ...dateQuery,
        }).lean(),
        ProjectModel.find({
          dealerId: { $in: dealerIds },
          ...dateQuery,
        }).lean(),
      ]);

      const reports = allDealers.map((d) => {
        const dLeads = leadsInRange.filter((l) => l.dealerId === d.dealerId);
        const dProjects = projectsInRange.filter((p) => p.dealerId === d.dealerId);

        const totalLeads = dLeads.length;
        const convertedCustomers = dProjects.length;
        const installedProjects = dProjects.filter((p) => p.solarInstallation?.installationStatus === "COMPLETED").length;
        const pendingProjects = convertedCustomers - installedProjects;
        const rejectedLeads = dLeads.filter((l) => l.status === "REJECTED").length;

        const totalProjectValue = dProjects.reduce((acc, p) => acc + (p.payments?.totalProjectCost || 0), 0);
        const paymentReceived = dProjects.reduce((acc, p) => acc + (p.payments?.amountPaid || 0), 0);
        const paymentPending = dProjects.reduce((acc, p) => acc + (p.payments?.amountRemaining || 0), 0);
        const complaints = dProjects.reduce(
          (acc, p) => acc + (p.issues?.filter((i: any) => ["OPEN", "IN_PROGRESS", "WAITING"].includes(i.status)).length || 0),
          0
        );

        const conversionRate = totalLeads > 0 ? ((convertedCustomers / totalLeads) * 100).toFixed(1) : "0.0";

        return {
          dealerId: d.dealerId,
          dealerName: d.dealerName,
          contactPerson: d.contactPerson,
          mobile: d.mobile,
          city: d.city,
          totalLeads,
          convertedCustomers,
          installedProjects,
          pendingProjects,
          rejectedLeads,
          totalProjectValue,
          paymentReceived,
          paymentPending,
          complaints,
          conversionRate,
        };
      });

      return jsonResponse({
        success: true,
        range,
        startDate: startDate.toISOString(),
        reports,
      });
    }

    // Match /api/dealers/:id (or /api/dealers/:id/clients)
    const dealerActionMatch = path.match(/^\/api\/dealers\/([a-zA-Z0-9_-]+)(?:\/([a-zA-Z0-9_-]+))?$/);
    if (dealerActionMatch) {
      const dealerParam = dealerActionMatch[1];
      const action = dealerActionMatch[2]; // e.g. "clients"
      await connectDB();

      const dealer = await DealerModel.findOne({
        $or: [
          { dealerId: dealerParam },
          { _id: dealerParam.match(/^[0-9a-fA-F]{24}$/) ? dealerParam : undefined },
        ],
      });

      if (!dealer) return errorResponse("Dealer not found", 404);

      // GET /api/dealers/:id (Dealer Profile & Real-time Breakdown)
      if (!action && method === "GET") {
        const [allLeads, allProjects] = await Promise.all([
          LeadModel.find({ dealerId: dealer.dealerId }).lean(),
          ProjectModel.find({ dealerId: dealer.dealerId }).lean(),
        ]);

        const unconvertedLeads = allLeads.filter((l) => !l.convertedToProjectId);

        const statusBreakdown: Record<string, number> = {
          NEW: 0,
          SITE_SURVEY: 0,
          QUOTATION_SENT: 0,
          APPROVED: 0,
          INSTALLATION_SCHEDULED: 0,
          INSTALLED: 0,
          CLOSED: 0,
          REJECTED: 0,
        };

        allLeads.forEach((l) => {
          if (statusBreakdown[l.status] !== undefined) {
            statusBreakdown[l.status] += 1;
          }
        });

        const totalEnquiries = allLeads.length;
        const totalCustomers = allProjects.length;
        const installedCustomers = allProjects.filter((p) => p.solarInstallation?.installationStatus === "COMPLETED").length;
        const pendingCustomers = totalCustomers - installedCustomers;
        const openComplaints = allProjects.reduce(
          (acc, p) => acc + (p.issues?.filter((i: any) => ["OPEN", "IN_PROGRESS", "WAITING"].includes(i.status)).length || 0),
          0
        );

        const totalClients = unconvertedLeads.length + allProjects.length;
        const totalProjectValue = allProjects.reduce((acc, p) => acc + (p.payments?.totalProjectCost || 0), 0);
        const amountPaid = allProjects.reduce((acc, p) => acc + (p.payments?.amountPaid || 0), 0);
        const amountRemaining = allProjects.reduce((acc, p) => acc + (p.payments?.amountRemaining || 0), 0);

        return jsonResponse({
          success: true,
          dealer,
          stats: {
            totalClients,
            totalEnquiries,
            totalCustomers,
            installedCustomers,
            pendingCustomers,
            openComplaints,
            totalProjectValue,
            amountPaid,
            amountRemaining,
            statusBreakdown,
          },
        });
      }

      // GET /api/dealers/:id/clients (Unified Clients Table)
      if (action === "clients" && method === "GET") {
        const [unconvertedLeads, projects] = await Promise.all([
          LeadModel.find({
            dealerId: dealer.dealerId,
            convertedToProjectId: { $in: ["", null] },
          })
            .sort({ createdAt: -1 })
            .lean(),
          ProjectModel.find({
            dealerId: dealer.dealerId,
          })
            .sort({ createdAt: -1 })
            .lean(),
        ]);

        const clients = [
          ...projects.map((p) => ({
            id: (p._id as any).toString(),
            type: "PROJECT",
            enquiryId: p.enquiryId || "",
            projectId: p.projectId,
            customerName: p.customerName,
            mobile: p.mobile,
            city: p.city,
            capacityKW: p.solarInstallation?.capacityKW || 0,
            company: p.solarInstallation?.companyName || "N/A",
            product: p.solarInstallation?.panelModel || "Solar System",
            installationStatus: p.solarInstallation?.installationStatus || "NOT_SCHEDULED",
            paymentStatus: p.payments?.paymentStatus || "PENDING",
            loanStatus: p.bankLoan?.loanStatus || "NOT_REQUIRED",
            subsidyStatus: p.subsidyTracking?.centralSubsidy?.status || "NOT_APPLIED",
            technician: p.technicianDetails?.technicianName || "Unassigned",
            createdAt: p.createdAt,
          })),
          ...unconvertedLeads.map((l) => ({
            id: (l._id as any).toString(),
            type: "LEAD",
            enquiryId: l.enquiryId || "",
            projectId: "",
            customerName: l.name,
            mobile: l.phone,
            city: l.city,
            capacityKW: l.requiredCapacityKW || 0,
            company: l.interestedCompany || "N/A",
            product: l.interestedProduct || "Solar Inquiry",
            installationStatus: "ENQUIRY_STAGE",
            paymentStatus: "N/A",
            loanStatus: "N/A",
            subsidyStatus: "N/A",
            technician: "Unassigned",
            createdAt: l.createdAt,
          })),
        ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return jsonResponse({
          success: true,
          dealer: {
            dealerId: dealer.dealerId,
            dealerName: dealer.dealerName,
          },
          clients,
          total: clients.length,
        });
      }

      // PATCH /api/dealers/:id (Update Dealer fields / toggle active)
      if (!action && method === "PATCH") {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return errorResponse("Invalid JSON payload", 400);
        }

        const parseResult = updateDealerSchema.safeParse(body);
        if (!parseResult.success) {
          return errorResponse("Validation failed", 422, parseResult.error.flatten());
        }

        const updateData = parseResult.data;
        Object.assign(dealer, updateData);
        await dealer.save();

        return jsonResponse({
          success: true,
          message: `Dealer ${dealer.dealerName} updated successfully`,
          dealer,
        });
      }

      // DELETE /api/dealers/:id (Delete Dealer)
      if (!action && method === "DELETE") {
        await DealerModel.findByIdAndDelete(dealer._id);
        return jsonResponse({
          success: true,
          message: `Dealer ${dealer.dealerId} (${dealer.dealerName}) deleted successfully`,
        });
      }
    }

    // ----------------------------------------------------
    // 8. ADMIN SOLAR COMPANIES CRUD
    // ----------------------------------------------------

    // POST /api/companies (Admin)
    if (path === "/api/companies" && method === "POST") {
      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return errorResponse("Invalid JSON", 400);
      }

      const parseResult = createCompanySchema.safeParse(body);
      if (!parseResult.success) {
        return errorResponse("Validation failed", 422, parseResult.error.flatten());
      }

      await connectDB();
      const compData = parseResult.data;
      const slug = slugify(compData.name);

      const existing = await SolarCompanyModel.findOne({ slug });
      if (existing) {
        return errorResponse(`Company with name "${compData.name}" already exists`, 409);
      }

      const newCompany = await SolarCompanyModel.create({
        ...compData,
        slug,
      });

      // Automatically initialize 1 to 20 KW packages for this new company
      const defaultPackages = [];
      for (let kw = 1; kw <= 20; kw++) {
        const panelWattage = 550;
        const panelCount = Math.ceil((kw * 1000) / panelWattage);
        const sellingPrice = kw * 58000;
        const basePrice = Math.round(sellingPrice * 1.15);
        const subsidy = kw === 1 ? 45000 : kw === 2 ? 90000 : 108000;

        defaultPackages.push({
          companyId: newCompany._id,
          companyName: newCompany.name,
          companySlug: newCompany.slug,
          model: `${newCompany.name} On-Grid ${kw} KW System`,
          capacityKW: kw,
          panelWattage,
          panelCount,
          inverterBrand: `${newCompany.name} Smart Inverter`,
          inverterModel: `${kw}KW-OG-550`,
          structureType: "Hot Dip Galvanized Rooftop Structure",
          batteryIncluded: false,
          installationIncluded: true,
          netMeteringIncluded: true,
          warranty: "25 Years Panel / 5 Years Inverter",
          basePrice,
          sellingPrice,
          discount: basePrice - sellingPrice,
          subsidy,
          available: true,
          active: true,
          description: `Complete ${kw} KW solar system package by ${newCompany.name}.`,
        });
      }

      await SolarPackageModel.insertMany(defaultPackages);

      return jsonResponse(
        {
          success: true,
          message: `Company "${newCompany.name}" added with 1-20 KW packages initialized!`,
          company: newCompany,
        },
        201
      );
    }

    // PATCH & DELETE for /api/companies/:id
    const companyIdMatch = path.match(/^\/api\/companies\/([a-zA-Z0-9_-]+)$/);
    if (companyIdMatch) {
      const companyId = companyIdMatch[1];
      await connectDB();

      if (method === "PATCH") {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return errorResponse("Invalid JSON", 400);
        }

        const parseResult = updateCompanySchema.safeParse(body);
        if (!parseResult.success) {
          return errorResponse("Validation failed", 422, parseResult.error.flatten());
        }

        const updated = await SolarCompanyModel.findByIdAndUpdate(
          companyId,
          { $set: parseResult.data },
          { new: true }
        );
        if (!updated) return errorResponse("Company not found", 404);

        if (parseResult.data.name) {
          await SolarPackageModel.updateMany(
            { companyId },
            { $set: { companyName: updated.name, companySlug: updated.slug } }
          );
        }

        return jsonResponse({
          success: true,
          message: "Company updated successfully",
          company: updated,
        });
      }

      if (method === "DELETE") {
        const deleted = await SolarCompanyModel.findByIdAndDelete(companyId);
        if (!deleted) return errorResponse("Company not found", 404);

        await SolarPackageModel.deleteMany({ companyId });

        return jsonResponse({
          success: true,
          message: "Company and its packages removed successfully",
        });
      }
    }

    // ----------------------------------------------------
    // 8. ADMIN SOLAR PACKAGES CRUD
    // ----------------------------------------------------

    // POST /api/packages (Admin)
    if (path === "/api/packages" && method === "POST") {
      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return errorResponse("Invalid JSON", 400);
      }

      const parseResult = createPackageSchema.safeParse(body);
      if (!parseResult.success) {
        return errorResponse("Validation failed", 422, parseResult.error.flatten());
      }

      await connectDB();
      const pkgData = parseResult.data;
      const comp = await SolarCompanyModel.findById(pkgData.companyId);
      if (!comp) return errorResponse("Referenced company not found", 404);

      const existing = await SolarPackageModel.findOne({
        companyId: pkgData.companyId,
        capacityKW: pkgData.capacityKW,
      });

      if (existing) {
        return errorResponse(
          `A package for ${comp.name} with capacity ${pkgData.capacityKW} KW already exists. Please edit it instead.`,
          409
        );
      }

      const newPkg = await SolarPackageModel.create({
        ...pkgData,
        companyName: comp.name,
        companySlug: comp.slug,
      });

      return jsonResponse({
        success: true,
        message: "Solar package created successfully",
        package: newPkg,
      }, 201);
    }

    // PATCH & DELETE for /api/packages/:id
    if (singlePackageMatch) {
      const pkgId = singlePackageMatch[1];
      await connectDB();

      if (method === "PATCH") {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return errorResponse("Invalid JSON", 400);
        }

        const parseResult = updatePackageSchema.safeParse(body);
        if (!parseResult.success) {
          return errorResponse("Validation failed", 422, parseResult.error.flatten());
        }

        const updated = await SolarPackageModel.findByIdAndUpdate(
          pkgId,
          { $set: parseResult.data },
          { new: true }
        );
        if (!updated) return errorResponse("Package not found", 404);

        return jsonResponse({
          success: true,
          message: "Package updated successfully",
          package: updated,
        });
      }

      if (method === "DELETE") {
        const deleted = await SolarPackageModel.findByIdAndDelete(pkgId);
        if (!deleted) return errorResponse("Package not found", 404);

        return jsonResponse({
          success: true,
          message: "Package deleted successfully",
        });
      }
    }

    // ----------------------------------------------------
    // 9. ADMIN QUICK PRICING & AVAILABILITY MATRIX (1-20 KW)
    // ----------------------------------------------------

    // GET /api/matrix
    if (path === "/api/matrix" && method === "GET") {
      await connectDB();
      const companies = await SolarCompanyModel.find({ active: true }).sort({ order: 1, name: 1 });
      const packages = await SolarPackageModel.find({ active: true });

      // Structure 2D matrix: Company x [1..20 KW]
      const matrix = companies.map((comp) => {
        const compPackages: Record<number, {
          id: string;
          sellingPrice: number;
          basePrice: number;
          subsidy: number;
          available: boolean;
        }> = {};

        packages
          .filter((p) => p.companyId.toString() === comp._id.toString())
          .forEach((p) => {
            compPackages[p.capacityKW] = {
              id: (p._id as unknown as string).toString(),
              sellingPrice: p.sellingPrice,
              basePrice: p.basePrice,
              subsidy: p.subsidy,
              available: p.available,
            };
          });

        return {
          companyId: comp._id,
          companyName: comp.name,
          companySlug: comp.slug,
          logo: comp.logo,
          capacities: compPackages,
        };
      });

      return jsonResponse({ success: true, matrix });
    }

    // PATCH /api/matrix/cell (Quick inline price/availability update)
    if (path === "/api/matrix/cell" && method === "PATCH") {
      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return errorResponse("Invalid JSON", 400);
      }

      const parseResult = quickMatrixUpdateSchema.safeParse(body);
      if (!parseResult.success) {
        return errorResponse("Validation failed", 422, parseResult.error.flatten());
      }

      const { companyId, capacityKW, sellingPrice, basePrice, available, subsidy } = parseResult.data;

      await connectDB();
      const comp = await SolarCompanyModel.findById(companyId);
      if (!comp) return errorResponse("Company not found", 404);

      let pkg = await SolarPackageModel.findOne({ companyId, capacityKW });

      if (!pkg) {
        const price = sellingPrice || capacityKW * 58000;
        pkg = await SolarPackageModel.create({
          companyId,
          companyName: comp.name,
          companySlug: comp.slug,
          model: `${comp.name} On-Grid ${capacityKW} KW System`,
          capacityKW,
          panelWattage: 550,
          panelCount: Math.ceil((capacityKW * 1000) / 550),
          inverterBrand: `${comp.name} Inverter`,
          sellingPrice: price,
          basePrice: basePrice || Math.round(price * 1.15),
          subsidy: subsidy || (capacityKW === 1 ? 45000 : capacityKW === 2 ? 90000 : 108000),
          available: available !== undefined ? available : true,
          active: true,
        });
      } else {
        if (sellingPrice !== undefined) pkg.sellingPrice = sellingPrice;
        if (basePrice !== undefined) pkg.basePrice = basePrice;
        if (available !== undefined) pkg.available = available;
        if (subsidy !== undefined) pkg.subsidy = subsidy;
        await pkg.save();
      }

      return jsonResponse({
        success: true,
        message: `${comp.name} ${capacityKW} KW updated! Price: ₹${pkg.sellingPrice}, Available: ${pkg.available}`,
        package: pkg,
      });
    }

    // ----------------------------------------------------
    // 10. ADMIN TECHNICIANS MANAGEMENT
    // ----------------------------------------------------

    // GET /api/technicians (List all technicians with search and status filter)
    if (path === "/api/technicians" && method === "GET") {
      await connectDB();
      const search = (url.searchParams.get("search") || "").trim();
      const availability = (url.searchParams.get("availability") || "ALL").toUpperCase();
      const activeParam = url.searchParams.get("active");

      const query: Record<string, unknown> = {};
      if (availability && availability !== "ALL") query.availability = availability;
      if (activeParam === "true") query.active = true;
      if (activeParam === "false") query.active = false;

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { technicianId: { $regex: search, $options: "i" } },
          { specialization: { $regex: search, $options: "i" } },
          { address: { $regex: search, $options: "i" } },
        ];
      }

      // Automatically seed sample technicians if none exist
      const count = await TechnicianModel.countDocuments();
      if (count === 0) {
        const seedTechs = [
          {
            technicianId: "MS-TECH-2026-000001",
            name: "Ramesh Sharma",
            phone: "9876543210",
            email: "ramesh.solar@matrishakti.com",
            address: "Gorakhpur Road, Maharajganj",
            specialization: "Solar Rooftop Systems, Inverter & Net Metering",
            active: true,
            availability: "AVAILABLE",
            assignedJobsCount: 4,
            notes: "Lead installation technician with 6+ years experience.",
          },
          {
            technicianId: "MS-TECH-2026-000002",
            name: "Amit Kumar",
            phone: "9876543211",
            email: "amit.tech@matrishakti.com",
            address: "Civil Lines, Gorakhpur",
            specialization: "Commercial & Industrial Rooftop Solar",
            active: true,
            availability: "ON_JOB",
            assignedJobsCount: 2,
            notes: "Site survey & heavy structural framing specialist.",
          },
          {
            technicianId: "MS-TECH-2026-000003",
            name: "Suresh Yadav",
            phone: "9876543212",
            email: "suresh.y@matrishakti.com",
            address: "Paniyara, Maharajganj",
            specialization: "Maintenance, Wiring, Earthing & Repairs",
            active: true,
            availability: "AVAILABLE",
            assignedJobsCount: 1,
            notes: "Quick response technician for customer complaints and cleaning.",
          },
        ];
        try {
          await TechnicianModel.insertMany(seedTechs);
        } catch {
          // ignore duplicate race
        }
      }

      const technicians = await TechnicianModel.find(query).sort({ active: -1, name: 1 });
      return jsonResponse({ success: true, technicians });
    }

    // POST /api/technicians (Create Technician)
    if (path === "/api/technicians" && method === "POST") {
      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return errorResponse("Invalid JSON payload", 400);
      }

      const parseResult = createTechnicianSchema.safeParse(body);
      if (!parseResult.success) {
        return errorResponse("Validation failed", 422, parseResult.error.flatten());
      }

      const validData = parseResult.data;
      await connectDB();

      const existingPhone = await TechnicianModel.findOne({ phone: validData.phone });
      if (existingPhone) {
        return errorResponse(`Technician with phone ${validData.phone} already registered (${existingPhone.technicianId})`, 409);
      }

      const technicianId = await getNextSequence("technician");
      const newTech = await TechnicianModel.create({
        ...validData,
        technicianId,
        assignedJobsCount: 0,
        assignedProjectIds: [],
        assignedComplaintIds: [],
      });

      return jsonResponse(
        {
          success: true,
          message: `Technician ${newTech.name} registered successfully with ID ${technicianId}!`,
          technician: newTech,
        },
        201
      );
    }

    // Match /api/technicians/:id
    const techMatch = path.match(/^\/api\/technicians\/([a-zA-Z0-9_-]+)$/);
    if (techMatch) {
      const techParam = techMatch[1];
      await connectDB();

      const technician = await TechnicianModel.findOne({
        $or: [
          { technicianId: techParam },
          { _id: techParam.match(/^[0-9a-fA-F]{24}$/) ? techParam : undefined },
        ],
      });

      if (!technician) return errorResponse("Technician not found", 404);

      if (method === "GET") {
        return jsonResponse({ success: true, technician });
      }

      if (method === "PATCH") {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return errorResponse("Invalid JSON payload", 400);
        }

        const parseResult = updateTechnicianSchema.safeParse(body);
        if (!parseResult.success) {
          return errorResponse("Validation failed", 422, parseResult.error.flatten());
        }

        Object.assign(technician, parseResult.data);
        await technician.save();

        return jsonResponse({
          success: true,
          message: `Technician ${technician.name} updated successfully`,
          technician,
        });
      }

      if (method === "DELETE") {
        await TechnicianModel.findByIdAndDelete(technician._id);
        return jsonResponse({
          success: true,
          message: `Technician ${technician.technicianId} deleted successfully`,
        });
      }
    }

    // ----------------------------------------------------
    // 11. ADMIN COMPLAINTS CRM
    // ----------------------------------------------------

    // GET /api/complaints (Admin list with filters & pagination)
    if (path === "/api/complaints" && method === "GET") {
      await connectDB();
      const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
      const limit = Math.max(1, parseInt(url.searchParams.get("limit") || "15", 10));
      const search = (url.searchParams.get("search") || "").trim();
      const status = (url.searchParams.get("status") || "ALL").trim();
      const priority = (url.searchParams.get("priority") || "ALL").trim();
      const category = (url.searchParams.get("category") || "ALL").trim();

      const query: Record<string, unknown> = {};
      if (status && status !== "ALL") query.status = status;
      if (priority && priority !== "ALL") query.priority = priority;
      if (category && category !== "ALL") query.category = category;

      if (search) {
        query.$or = [
          { complaintId: { $regex: search, $options: "i" } },
          { customerName: { $regex: search, $options: "i" } },
          { mobile: { $regex: search, $options: "i" } },
          { projectId: { $regex: search, $options: "i" } },
          { companyName: { $regex: search, $options: "i" } },
          { assignedTechnicianName: { $regex: search, $options: "i" } },
        ];
      }

      const total = await ComplaintModel.countDocuments(query);
      const complaints = await ComplaintModel.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      return jsonResponse({
        success: true,
        complaints,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        },
      });
    }

    // Match /api/complaints/:id
    const complaintMatch = path.match(/^\/api\/complaints\/([a-zA-Z0-9_-]+)$/);
    if (complaintMatch) {
      const cParam = complaintMatch[1];
      await connectDB();

      const complaint = await ComplaintModel.findOne({
        $or: [
          { complaintId: cParam },
          { _id: cParam.match(/^[0-9a-fA-F]{24}$/) ? cParam : undefined },
        ],
      });

      if (!complaint) return errorResponse("Complaint record not found", 404);

      if (method === "GET") {
        return jsonResponse({ success: true, complaint });
      }

      // PATCH /api/complaints/:id (Update status, priority, technician, resolution)
      if (method === "PATCH") {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return errorResponse("Invalid JSON payload", 400);
        }

        const parseResult = updateComplaintSchema.safeParse(body);
        if (!parseResult.success) {
          return errorResponse("Validation failed", 422, parseResult.error.flatten());
        }

        const updateData = parseResult.data;
        const oldStatus = complaint.status;

        // Apply fields
        if (updateData.status) complaint.status = updateData.status;
        if (updateData.priority) complaint.priority = updateData.priority;
        if (updateData.assignedTechnicianName) {
          complaint.assignedTechnicianName = updateData.assignedTechnicianName;
          complaint.assignedDate = new Date().toISOString().split("T")[0];
          // If status was RECEIVED or UNDER_REVIEW, transition to TECHNICIAN_ASSIGNED
          if (["RECEIVED", "UNDER_REVIEW"].includes(complaint.status)) {
            complaint.status = "TECHNICIAN_ASSIGNED";
          }
        }
        if (updateData.assignedTechnicianId) complaint.assignedTechnicianId = updateData.assignedTechnicianId;
        if (updateData.resolution) {
          complaint.resolution = updateData.resolution;
          complaint.resolutionDate = new Date().toISOString().split("T")[0];
        }
        if (updateData.notes) complaint.notes = updateData.notes;

        // Automatically log timeline event
        const timelineTitle =
          updateData.status && updateData.status !== oldStatus
            ? `Status updated to ${updateData.status}`
            : updateData.assignedTechnicianName
            ? `Technician Assigned: ${updateData.assignedTechnicianName}`
            : updateData.resolution
            ? `Resolution recorded`
            : `Complaint details updated`;

        complaint.timeline.push({
          id: Date.now().toString(),
          status: complaint.status,
          title: timelineTitle,
          date: new Date().toISOString().split("T")[0],
          time: new Date().toLocaleTimeString(),
          user: currentAdmin.name || "Admin",
          notes: updateData.notes || updateData.resolution || `Changed from ${oldStatus} to ${complaint.status}`,
        });

        await complaint.save();

        return jsonResponse({
          success: true,
          message: "Complaint updated successfully",
          complaint,
        });
      }

      if (method === "DELETE") {
        await ComplaintModel.findByIdAndDelete(complaint._id);
        return jsonResponse({
          success: true,
          message: `Complaint ${complaint.complaintId} deleted successfully`,
        });
      }
    }

    // ----------------------------------------------------
    // 12. ADMIN INSTALLATIONS / GALLERY SHOWCASE MANAGEMENT
    // ----------------------------------------------------

    // GET /api/installations/admin (Admin list of all showcase items)
    if (path === "/api/installations/admin" && method === "GET") {
      await connectDB();
      const installations = await InstallationModel.find().sort({ createdAt: -1 });
      return jsonResponse({ success: true, installations });
    }

    // POST /api/installations (Admin create showcase installation)
    if (path === "/api/installations" && method === "POST") {
      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return errorResponse("Invalid JSON payload", 400);
      }

      const parseResult = createInstallationSchema.safeParse(body);
      if (!parseResult.success) {
        return errorResponse("Validation failed", 422, parseResult.error.flatten());
      }

      await connectDB();
      const newInstallation = await InstallationModel.create(parseResult.data);

      return jsonResponse(
        {
          success: true,
          message: "Installation showcase added successfully!",
          installation: newInstallation,
        },
        201
      );
    }

    // Match /api/installations/:id
    const installationMatch = path.match(/^\/api\/installations\/([a-zA-Z0-9_-]+)$/);
    if (installationMatch) {
      const instId = installationMatch[1];
      await connectDB();

      if (method === "PATCH") {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return errorResponse("Invalid JSON payload", 400);
        }

        const parseResult = updateInstallationSchema.safeParse(body);
        if (!parseResult.success) {
          return errorResponse("Validation failed", 422, parseResult.error.flatten());
        }

        const updated = await InstallationModel.findByIdAndUpdate(
          instId,
          { $set: parseResult.data },
          { new: true }
        );
        if (!updated) return errorResponse("Installation not found", 404);

        return jsonResponse({
          success: true,
          message: "Installation updated successfully",
          installation: updated,
        });
      }

      if (method === "DELETE") {
        const deleted = await InstallationModel.findByIdAndDelete(instId);
        if (!deleted) return errorResponse("Installation not found", 404);

        return jsonResponse({
          success: true,
          message: "Installation deleted successfully",
        });
      }
    }

    return errorResponse(`Endpoint ${method} ${path} not found`, 404);

  } catch (err: unknown) {
    console.error(`[API Error] ${method} ${path}:`, err);
    if (err instanceof ZodError) {
      return errorResponse("Validation error", 422, err.flatten());
    }
    const message = (err as Error).message || "Internal server error";
    return errorResponse(message, 500);
  }
}
