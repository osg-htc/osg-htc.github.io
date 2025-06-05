/**
 * A collection of functions for uniform queries to the adstash ES endpoint
 */
import ElasticSearchQuery, {ADSTASH_ENDPOINT, ADSTASH_SUMMARY_INDEX, DATE_RANGE} from "./elasticsearch-v1.js";

export const getOverview = async () => {
	const elasticSearch = new ElasticSearchQuery(ADSTASH_SUMMARY_INDEX, ADSTASH_ENDPOINT)

	let usageQueryResult = await elasticSearch.search({
		size: 0,
		query: {
			range: {
				Date: {
					lte: DATE_RANGE['now'],
					gte: DATE_RANGE['oneYearAgo']
				}
			}
		},
		"aggs": {
			"projects": {
				"terms": {
					"field": "ProjectName.keyword",
					"size": 10000
				},
				"aggs": {
					"NumJobs": {
						"sum": {
							"field": "NumJobs"
						}
					},
					"FileTransferCount": {
						"sum": {
							"field": "FileTransferCount"
						}
					},
					"ByteTransferCount": {
						"sum": {
							"field": "ByteTransferCount"
						}
					},
					"CpuHours": {
						"sum": {
							"field": "CpuHours"
						}
					},
					"GpuHours": {
						"sum": {
							"field": "GpuHours"
						}
					},
					"OSDFFileTransferCount": {
						"sum": {
							"field": "OSDFFileTransferCount"
						}
					},
					"OSDFByteTransferCount": {
						"sum": {
							"field": "OSDFByteTransferCount"
						}
					},
					"CommonFields": {
						"top_hits": {
							"_source": {
								"includes": COMMON_FIELDS
							},
							"size": 1
						}
					}
				}
			}
		}
	})

	let projectBuckets = usageQueryResult.aggregations.projects.buckets

	try {

	   // Simplify the data keys
		 return projectBuckets.reduce((p, v) => {

			// If the project is not mapped skip it
			if(v['CommonFields']['hits']['hits'][0]['_source']['ProjectInstitution']?.['name'] === undefined){
				return p
			}

			p[v['key']] = {
				projectName: v['key'],
				numJobs: v['NumJobs']['value'],
				cpuHours: v['CpuHours']['value'],
				gpuHours: v['GpuHours']['value'],
				fileTransferCount: v['FileTransferCount']['value'],
				byteTransferCount: v['ByteTransferCount']['value'],
				osdfFileTransferCount: v['OSDFFileTransferCount']['value'],
				osdfByteTransferCount: v['OSDFByteTransferCount']['value'],
				broadFieldOfScience: v['CommonFields']['hits']['hits'][0]['_source']['BroadFieldOfScience'],
				majorFieldOfScience: v['CommonFields']['hits']['hits'][0]['_source']['MajorFieldOfScience'],
				detailedFieldOfScience: v['CommonFields']['hits']['hits'][0]['_source']['DetailedFieldOfScience'],
				projectInstitutionName: v['CommonFields']['hits']['hits'][0]['_source']['ProjectInstitution']?.['name'],
				projectInstitutionIpedsWebsiteAddress: v['CommonFields']['hits']['hits'][0]['_source']?.['ProjectInstitution']?.['ipeds_metadata']?.['website_address'],
				projectInstitutionIpedsHistoricallyBlackCollegeOrUniversity: v['CommonFields']['hits']['hits'][0]['_source']?.['ProjectInstitution']?.['ipeds_metadata']?.['historically_black_college_or_university'],
				projectInstitutionIpedsTribalCollegeOrUniversity: v['CommonFields']['hits']['hits'][0]['_source']?.['ProjectInstitution']?.['ipeds_metadata']?.['tribal_college_or_university'],
				projectInstitutionIpedsState: v['CommonFields']['hits']['hits'][0]['_source']?.['ProjectInstitution']?.['ipeds_metadata']?.['state'],
				projectEpscorState: EPSCOR_STATES.includes(v['CommonFields']['hits']['hits'][0]['_source']?.['ProjectInstitution']?.['ipeds_metadata']?.['state'])
			}
			return p
		}, {})
	} catch(e){
		console.log(e)
	}

	return {}
}

export const getProjectOverview = async (projectName) => {
	const elasticSearch = new ElasticSearchQuery(ADSTASH_SUMMARY_INDEX, ADSTASH_ENDPOINT)

	let usageQueryResult = await elasticSearch.search({
		size: 0,
		query: {
			bool: {
				filter: [
					{
						range: {
							Date: {
								lte: DATE_RANGE['now'],
								gte: DATE_RANGE['oneYearAgo']
							}
						},
					},
					{
						term: {
							"ProjectName.keyword": projectName
						}
					}
				]
			}
		},
		"aggs": {
			"institutions": {
				"terms": {
					"field": "ResourceInstitution.name.keyword",
					"size": 10000
				},
				"aggs": {
					"NumJobs": {
						"sum": {
							"field": "NumJobs"
						}
					},
					"FileTransferCount": {
						"sum": {
							"field": "FileTransferCount"
						}
					},
					"ByteTransferCount": {
						"sum": {
							"field": "ByteTransferCount"
						}
					},
					"CpuHours": {
						"sum": {
							"field": "CpuHours"
						}
					},
					"GpuHours": {
						"sum": {
							"field": "GpuHours"
						}
					},
					"OSDFFileTransferCount": {
						"sum": {
							"field": "OSDFFileTransferCount"
						}
					},
					"OSDFByteTransferCount": {
						"sum": {
							"field": "OSDFByteTransferCount"
						}
					}
				}
			}
		}
	})

	let institutionBuckets = usageQueryResult.aggregations.institutions.buckets

	try {
		return institutionBuckets.reduce((p, v) => {

			p[v['key']] = {
				projectName: v['key'],
				numJobs: v['NumJobs']['value'],
				cpuHours: v['CpuHours']['value'],
				gpuHours: v['GpuHours']['value'],
				fileTransferCount: v['FileTransferCount']['value'],
				byteTransferCount: v['ByteTransferCount']['value'],
				osdfFileTransferCount: v['OSDFFileTransferCount']['value'],
				osdfByteTransferCount: v['OSDFByteTransferCount']['value']
			}

			return p
		}, {})
	} catch(e){
		console.log(e)
	}

	return {}
}

const EPSCOR_STATES = [
	"AL", // Alabama
	"AK", // Alaska
	"AR", // Arkansas
	"DE", // Delaware
	"GU", // Guam
	"HI", // Hawaii
	"ID", // Idaho
	"IA", // Iowa
	"KS", // Kansas
	"KY", // Kentucky
	"LA", // Louisiana
	"ME", // Maine
	"MS", // Mississippi
	"MT", // Montana
	"NE", // Nebraska
	"NV", // Nevada
	"NH", // New Hampshire
	"NM", // New Mexico
	"ND", // North Dakota
	"OK", // Oklahoma
	"PR", // Puerto Rico
	"RI", // Rhode Island
	"SC", // South Carolina
	"SD", // South Dakota
	"VI", // U.S. Virgin Islands
	"VT", // Vermont
	"WV", // West Virginia
	"WY"  // Wyoming
];

const COMMON_FIELDS = [
	"MajorFieldOfScience",
	"BroadFieldOfScience",
	"DetailedFieldOfScience",
	"ProjectInstitution.name",
	"ProjectInstitution.ipeds_metadata.website_address",
	"ProjectInstitution.ipeds_metadata.historically_black_college_or_university",
	"ProjectInstitution.ipeds_metadata.tribal_college_or_university",
	"ProjectInstitution.ipeds_metadata.state"
]
