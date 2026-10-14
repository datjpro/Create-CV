import type {
  ResumeLocalizedContent,
  ResumeLocalizedExperienceItem,
  ResumeLocalizedProjectItem,
  ResumeLocalizedEducationItem,
  ResumeLocalizedCertificationItem,
  ResumeLocalizedAwardItem,
  ResumeLocalizedActivityItem,
  SkillGroup
} from "@/lib/types";

const DICTIONARY: Record<string, string> = {
  // Job titles
  "kỹ sư phần mềm": "Software Engineer",
  "kỹ sư phát triển phần mềm": "Software Development Engineer",
  "kỹ sư hệ thống": "Systems Engineer",
  "lập trình viên": "Software Developer",
  "lập trình viên frontend": "Frontend Developer",
  "lập trình viên backend": "Backend Developer",
  "lập trình viên fullstack": "Full Stack Developer",
  "lập trình viên mobile": "Mobile Developer",
  "lập trình viên web": "Web Developer",
  "kỹ sư devops": "DevOps Engineer",
  "kỹ sư qa": "QA Engineer",
  "kỹ sư kiểm thử": "QA/QC Engineer",
  "kiểm thử phần mềm": "Software Tester",
  "chuyên viên phân tích nghiệp vụ": "Business Analyst",
  "quản lý sản phẩm": "Product Manager",
  "chuyên viên thiết kế ui/ux": "UI/UX Designer",
  "nhà thiết kế giao diện": "UI/UX Designer",
  "trưởng nhóm kỹ thuật": "Technical Lead",
  "trưởng nhóm phát triển": "Lead Developer",
  "trưởng nhóm": "Team Lead",
  "quản lý dự án": "Project Manager",
  "thực tập sinh": "Intern",
  "thực tập sinh phần mềm": "Software Engineering Intern",
  "nhân viên kinh doanh": "Sales Executive",
  "chuyên viên marketing": "Marketing Specialist",
  "chuyên viên nhân sự": "HR Specialist",
  "kế toán": "Accountant",
  "kế toán tổng hợp": "General Accountant",
  "chuyên viên tư vấn": "Consultant",

  // Degrees & Education
  "cử nhân công nghệ thông tin": "Bachelor of Information Technology",
  "cử nhân khoa học máy tính": "Bachelor of Computer Science",
  "kỹ sư công nghệ thông tin": "Bachelor of Information Technology",
  "kỹ sư công nghệ phần mềm": "Bachelor of Software Engineering",
  "cử nhân hệ thống thông tin": "Bachelor of Information Systems",
  "cử nhân quản trị kinh doanh": "Bachelor of Business Administration",
  "cử nhân tài chính ngân hàng": "Bachelor of Finance & Banking",
  "cử nhân kinh tế": "Bachelor of Economics",
  "cử nhân ngôn ngữ anh": "Bachelor of English Linguistics",
  "cử nhân": "Bachelor's Degree",
  "kỹ sư": "Engineer's Degree",
  "thạc sĩ": "Master's Degree",
  "tiến sĩ": "Ph.D.",
  "đại học bách khoa": "Bach Khoa University",
  "đại học bách khoa hà nội": "Hanoi University of Science & Technology",
  "đại học quốc gia hà nội": "Vietnam National University, Hanoi",
  "đại học quốc gia tp.hcm": "Vietnam National University, Ho Chi Minh City",
  "đại học quốc gia tp hồ chí minh": "Vietnam National University, Ho Chi Minh City",
  "đại học công nghệ": "University of Engineering and Technology (UET)",
  "đại học khoa học tự nhiên": "University of Science",
  "đại học kinh tế quốc dân": "National Economics University (NEU)",
  "đại học ngoại thương": "Foreign Trade University (FTU)",
  "đại học fpt": "FPT University",
  "học viện công nghệ bưu chính viễn thông": "Posts & Telecommunications Institute of Technology (PTIT)",
  "học viện bưu chính viễn thông": "Posts & Telecommunications Institute of Technology (PTIT)",
  "đại học sư phạm kỹ thuật": "University of Technology and Education",
  "đại học hoa sen": "Hoa Sen University",
  "đại học tôn đức thắng": "Ton Duc Thang University",

  // Locations & Work Types
  "hà nội": "Hanoi",
  "tp. hồ chí minh": "Ho Chi Minh City",
  "tp hồ chí minh": "Ho Chi Minh City",
  "hồ chí minh": "Ho Chi Minh City",
  "tp hcm": "Ho Chi Minh City",
  "tphcm": "Ho Chi Minh City",
  "đà nẵng": "Da Nang",
  "hải phòng": "Hai Phong",
  "cần thơ": "Can Tho",
  "việt nam": "Vietnam",
  "từ xa": "Remote",
  "tại văn phòng": "On-site",
  "kết hợp": "Hybrid",
  "hiện tại": "Present",

  // Skill Groups
  "kỹ năng cốt lõi": "Core Skills",
  "kỹ năng chuyên môn": "Technical Skills",
  "kỹ năng mềm": "Soft Skills",
  "ngôn ngữ lập trình": "Programming Languages",
  "công cụ & framework": "Frameworks & Tools",
  "công cụ và framework": "Frameworks & Tools",
  "cơ sở dữ liệu": "Databases",
  "đám mây & devops": "Cloud & DevOps",

  // Common skills
  "giao tiếp": "Communication",
  "làm việc nhóm": "Teamwork",
  "giải quyết vấn đề": "Problem Solving",
  "tư duy phản biện": "Critical Thinking",
  "quản lý thời gian": "Time Management",
  "lãnh đạo": "Leadership",
  "thuyết trình": "Presentation",
  "đàm phán": "Negotiation",
  "thích ứng nhanh": "Adaptability",
  "tự học": "Self-learning"
};

const VIETNAMESE_REGEX = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;

const translationCache = new Map<string, string>();

export async function translateTextToEnglish(text: string): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) {
    return text;
  }

  // 1. Check exact dictionary match (case insensitive)
  const lower = trimmed.toLowerCase();
  if (DICTIONARY[lower]) {
    return DICTIONARY[lower];
  }

  // 2. If text contains no Vietnamese diacritics, it's already English/code/brand names
  if (!VIETNAMESE_REGEX.test(trimmed)) {
    return trimmed;
  }

  // 3. Check memory cache
  if (translationCache.has(trimmed)) {
    return translationCache.get(trimmed)!;
  }

  // 4. Query translation service with timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=vi|en`;
    const response = await fetch(url, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const translated = data?.responseData?.translatedText;
      if (typeof translated === "string" && translated.trim() && !translated.includes("MYMEMORY WARNING")) {
        const result = translated.trim();
        translationCache.set(trimmed, result);
        return result;
      }
    }
  } catch {
    // Fall back gracefully on failure or timeout
  }

  // 5. Fallback dictionary replacements for keywords
  let fallback = trimmed;
  for (const [vi, en] of Object.entries(DICTIONARY)) {
    const regex = new RegExp(`\\b${vi}\\b`, "gi");
    fallback = fallback.replace(regex, en);
  }

  translationCache.set(trimmed, fallback);
  return fallback;
}

async function mapConcurrently<T, R>(items: T[], fn: (item: T) => Promise<R>, concurrency = 4): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const current = index++;
      results[current] = await fn(items[current]);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

export async function translateResumeContentToEnglish(content: ResumeLocalizedContent): Promise<ResumeLocalizedContent> {
  // Translate personal & summary in parallel
  const [title, personalTitle, personalLocation, summary] = await Promise.all([
    translateTextToEnglish(content.title),
    translateTextToEnglish(content.personal.title),
    translateTextToEnglish(content.personal.location),
    translateTextToEnglish(content.summary)
  ]);

  // Translate experiences
  const experiences: ResumeLocalizedExperienceItem[] = await mapConcurrently(
    content.experiences,
    async (item) => {
      const [jobTitle, employer, location, description, bullets] = await Promise.all([
        translateTextToEnglish(item.jobTitle),
        translateTextToEnglish(item.employer),
        translateTextToEnglish(item.location),
        translateTextToEnglish(item.description),
        mapConcurrently(item.bullets, (b) => translateTextToEnglish(b), 3)
      ]);

      return {
        id: item.id,
        jobTitle,
        employer,
        location,
        description,
        bullets
      };
    },
    2
  );

  // Translate skill groups
  const skillGroups: SkillGroup[] = await mapConcurrently(
    content.skillGroups,
    async (group) => {
      const [name, skills] = await Promise.all([
        translateTextToEnglish(group.name),
        mapConcurrently(group.skills, (s) => translateTextToEnglish(s), 4)
      ]);

      return {
        id: group.id,
        name,
        skills
      };
    },
    2
  );

  // Translate projects
  const projects: ResumeLocalizedProjectItem[] = await mapConcurrently(
    content.projects,
    async (project) => {
      const [name, role, description] = await Promise.all([
        translateTextToEnglish(project.name),
        translateTextToEnglish(project.role),
        translateTextToEnglish(project.description)
      ]);

      return {
        id: project.id,
        name,
        role,
        description
      };
    },
    2
  );

  // Translate education
  const education: ResumeLocalizedEducationItem[] = await mapConcurrently(
    content.education,
    async (item) => {
      const [degree, school, location, description] = await Promise.all([
        translateTextToEnglish(item.degree),
        translateTextToEnglish(item.school),
        translateTextToEnglish(item.location),
        translateTextToEnglish(item.description)
      ]);

      return {
        id: item.id,
        degree,
        school,
        location,
        description
      };
    },
    2
  );

  // Translate certifications
  const certifications: ResumeLocalizedCertificationItem[] = await mapConcurrently(
    content.certifications,
    async (item) => {
      const [name, issuer, description] = await Promise.all([
        translateTextToEnglish(item.name),
        translateTextToEnglish(item.issuer),
        translateTextToEnglish(item.description)
      ]);

      return {
        id: item.id,
        name,
        issuer,
        description
      };
    },
    2
  );

  // Translate awards
  const awards: ResumeLocalizedAwardItem[] = await mapConcurrently(
    content.awards,
    async (item) => {
      const [title, issuer, description] = await Promise.all([
        translateTextToEnglish(item.title),
        translateTextToEnglish(item.issuer),
        translateTextToEnglish(item.description)
      ]);

      return {
        id: item.id,
        title,
        issuer,
        description
      };
    },
    2
  );

  // Translate activities
  const activities: ResumeLocalizedActivityItem[] = await mapConcurrently(
    content.activities,
    async (item) => {
      const [name, organization, description] = await Promise.all([
        translateTextToEnglish(item.name),
        translateTextToEnglish(item.organization),
        translateTextToEnglish(item.description)
      ]);

      return {
        id: item.id,
        name,
        organization,
        description
      };
    },
    2
  );

  return {
    title,
    personal: {
      fullName: content.personal.fullName,
      title: personalTitle,
      location: personalLocation
    },
    summary,
    experiences,
    education,
    skillGroups,
    projects,
    certifications,
    awards,
    activities
  };
}
