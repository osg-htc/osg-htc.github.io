import ElasticSearchQuery, {
  ADSTASH_ENDPOINT,
  DATE_RANGE,
  ADSTASH_SUMMARY_INDEX,
} from "./elasticsearch-v1.js";
import Color from "https://colorjs.io/dist/color.js";

// rename React.createElement
const e = React.createElement;

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
  "WY", // Wyoming
];

const COMMON_FIELDS = [
  "MajorFieldOfScience",
  "BroadFieldOfScience",
  "DetailedFieldOfScience",
  "ProjectInstitution.name",
  "ProjectInstitution.ipeds_metadata.website_address",
  "ProjectInstitution.ipeds_metadata.historically_black_college_or_university",
  "ProjectInstitution.ipeds_metadata.tribal_college_or_university",
  "ProjectInstitution.ipeds_metadata.state",
];

/**
 * A suite of Boolean functions deciding the visual status of a certain grafana graph
 *
 * true results in the graph being shown, false the opposite
 */
const elasticSearch = new ElasticSearchQuery(
  ADSTASH_SUMMARY_INDEX,
  ADSTASH_ENDPOINT
);

class UsageToggles {
  static async getUsage() {
    if (this.usage) {
      return this.usage;
    }

    let usageQueryResult = await elasticSearch.search({
      size: 0,
      query: {
        range: {
          Date: {
            lte: DATE_RANGE["now"],
            gte: DATE_RANGE["oneYearAgo"],
          },
        },
      },
      aggs: {
        projects: {
          terms: {
            field: "ProjectName.keyword",
            size: 10000,
          },
          aggs: {
            NumJobs: {
              sum: {
                field: "NumJobs",
              },
            },
            FileTransferCount: {
              sum: {
                field: "FileTransferCount",
              },
            },
            ByteTransferCount: {
              sum: {
                field: "ByteTransferCount",
              },
            },
            CpuHours: {
              sum: {
                field: "CpuHours",
              },
            },
            GpuHours: {
              sum: {
                field: "GpuHours",
              },
            },
            OSDFFileTransferCount: {
              sum: {
                field: "OSDFFileTransferCount",
              },
            },
            OSDFByteTransferCount: {
              sum: {
                field: "OSDFByteTransferCount",
              },
            },
            CommonFields: {
              top_hits: {
                _source: {
                  includes: COMMON_FIELDS,
                },
                size: 1,
              },
            },
          },
        },
      },
    });

    let projectBuckets = usageQueryResult.aggregations.projects.buckets;
    try {
      this.usage = projectBuckets.reduce((p, v) => {
        // If the project is not mapped skip it
        if (
          v["CommonFields"]["hits"]["hits"][0]["_source"][
            "ProjectInstitution"
          ]?.["name"] === undefined
        ) {
          return p;
        }

        p[v["key"]] = {
          projectName: v["key"],
          numJobs: v["NumJobs"]["value"],
          cpuHours: v["CpuHours"]["value"],
          gpuHours: v["GpuHours"]["value"],
          fileTransferCount: v["FileTransferCount"]["value"],
          byteTransferCount: v["ByteTransferCount"]["value"],
          osdfFileTransferCount: v["OSDFFileTransferCount"]["value"],
          osdfByteTransferCount: v["OSDFByteTransferCount"]["value"],
          broadFieldOfScience:
            v["CommonFields"]["hits"]["hits"][0]["_source"][
              "BroadFieldOfScience"
            ],
          majorFieldOfScience:
            v["CommonFields"]["hits"]["hits"][0]["_source"][
              "MajorFieldOfScience"
            ],
          detailedFieldOfScience:
            v["CommonFields"]["hits"]["hits"][0]["_source"][
              "DetailedFieldOfScience"
            ],
          projectInstitutionName:
            v["CommonFields"]["hits"]["hits"][0]["_source"][
              "ProjectInstitution"
            ]?.["name"],
          projectInstitutionIpedsWebsiteAddress:
            v["CommonFields"]["hits"]["hits"][0]["_source"]?.[
              "ProjectInstitution"
            ]?.["ipeds_metadata"]?.["website_address"],
          projectInstitutionIpedsHistoricallyBlackCollegeOrUniversity:
            v["CommonFields"]["hits"]["hits"][0]["_source"]?.[
              "ProjectInstitution"
            ]?.["ipeds_metadata"]?.["historically_black_college_or_university"],
          projectInstitutionIpedsTribalCollegeOrUniversity:
            v["CommonFields"]["hits"]["hits"][0]["_source"]?.[
              "ProjectInstitution"
            ]?.["ipeds_metadata"]?.["tribal_college_or_university"],
          projectInstitutionIpedsState:
            v["CommonFields"]["hits"]["hits"][0]["_source"]?.[
              "ProjectInstitution"
            ]?.["ipeds_metadata"]?.["state"],
          projectEpscorState: EPSCOR_STATES.includes(
            v["CommonFields"]["hits"]["hits"][0]["_source"]?.[
              "ProjectInstitution"
            ]?.["ipeds_metadata"]?.["state"]
          ),
        };
        return p;
      }, {});
    } catch (e) {
      console.log(e);
    }

    return this.usage;
  }
}

class DataManager {
  constructor(filters, consumerToggles, errorNode) {
    this.filters = filters ? filters : {};
    this.consumerToggles = consumerToggles ? consumerToggles : [];
    this.errorNode = errorNode ? errorNode : document.getElementById("error");
    this.error = undefined;
  }

  toggleConsumers = () => {
    this.consumerToggles.forEach((f) => f());
  };

  addFilter = (name, filter) => {
    this.filters[name] = filter;
    this.toggleConsumers();
  };

  removeFilter = (name) => {
    delete this.filters[name];
    this.toggleConsumers();
  };

  getData = async () => {
    if (!this.data) {
      this.data = this._getData();
    }
    return this.data;
  };

  set error(error) {
    if (error) {
      this.errorNode.textContent = error;
      this.errorNode.style.display = "block";
    } else {
      this.errorNode.style.display = "none";
    }
  }

  async _getData() {
    let usageJson;
    try {
      usageJson = await UsageToggles.getUsage();
    } catch (e) {
      this.error =
        "Error fetching usage data, learn more on the status page: status.osg-htc.org";
    }

    this.data = usageJson;

    return this.data;
  }

  /**
   * Filters the original data and returns the remaining data
   * @returns {Promise<*>}
   */
  getFilteredData = async () => {
    let filteredData = await this.getData();
    for (const filter of Object.values(this.filters)) {
      filteredData = filter(filteredData);
    }
    return filteredData;
  };

  reduceByKey = async (key, value) => {
    let data = await this.getFilteredData();
    let reducedData = Object.values(data).reduce((p, v) => {
      if (v[key] in p) {
        p[v[key]] += v[value];
      } else {
        p[v[key]] = v[value];
      }
      return p;
    }, {});
    let sortedData = Object.entries(reducedData)
      .filter(([k, v]) => v > 0)
      .map(([k, v]) => {
        return { label: k, [value]: Math.round(v) };
      })
      .sort((a, b) => b[value] - a[value]);
    return {
      labels: sortedData.map((x) => x.label),
      data: sortedData.map((x) => x[value]),
    };
  };
}

function getColorOfName(context) {
  /**
   * Returns a hash code from a string
   * @param string The string to hash.
   * @return A 32bit integer
   * @see http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
   */
  function hashCode(str) {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
      let chr = str.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

  const colors = [
    "#37a2eb",
    "#ff6384",
    "#ff9e40",
    "#9966ff",
    "#ffcd56",
    "#4dbd74",
  ];

  const hash = hashCode(context) ** 2; // Make sure its positive

  let colorStr = colors[hash % (colors.length - 1)];

  let color = new Color(colorStr).to("lch");

  // Manipulate the color based on the hash
  color = new Color(color.lighten((hash % 19) / 100));
  color = new Color(color.darken((hash % 23) / 100));

  return color.to("srgb").toString();
}

async function mountPieCharts(dataManager) {
  const charts = [
    {
      id: "project-fos-file-summary",
      title: "# of Objects Transferred by Field Of Science",
      fetch: dataManager.reduceByKey.bind(
        dataManager,
        "majorFieldOfScience",
        "osdfFileTransferCount"
      ),
    },
    {
      id: "project-fos-byte-summary",
      title: "# of Bytes Transferred by Field Of Science",
      fetch: dataManager.reduceByKey.bind(
        dataManager,
        "majorFieldOfScience",
        "osdfByteTransferCount"
      ),
    },
    {
      id: "project-file-summary",
      title: "# of Objects Transferred by Project",
      fetch: dataManager.reduceByKey.bind(
        dataManager,
        "projectName",
        "osdfFileTransferCount"
      ),
    },
    {
      id: "project-byte-summary",
      title: "# of Bytes Transferred by Project",
      fetch: dataManager.reduceByKey.bind(
        dataManager,
        "projectName",
        "osdfByteTransferCount"
      ),
    },
  ];

  const chartData = await Promise.all(charts.map(({ fetch }) => fetch()));
  charts.forEach(({ id, title }, i) => {
    const chartContainer = document.getElementById(id);
    const data = chartData[i];

    if (chartContainer) {
      const root = ReactDOM.createRoot(chartContainer);

      const reorganizedData = data.labels.map((label, i) => {
        return { label, value: data.data[i] };
      });

      root.render(
        e(
          "div",
          {
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "20px",
            },
          },
          [
            // Pie chart wrapper
            e(
              "div",
              {
                style: {
                  maxWidth: "215px",
                  flex: "0 0 215px",
                },
              },
              // Pie Chart as child
              [
                e(CHTCWebComponents.PieChart, {
                  axisLabel: title,
                  bgColor: "#222529",
                  data: reorganizedData,
                }),
              ]
            ),
            // List to the side
            e(
              "div",
              {
                style: {
                  maxHeight: "250px",
                  overflowY: "auto",
                  padding: "10px 10px 10px 0",
                },
              },
              [
                // Actual ul
                e(
                  "ul",
                  {
                    style: {
                      listStyleType: "none",
                      padding: 0,
                      fontSize: "0.8rem",
                      overflowX: "auto",
                    },
                  },
                  reorganizedData.map((item) =>
                    // Each list element
                    e(
                      "li",
                      {
                        key: item.label,
                        style: {
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "4px",
                        },
                      },
                      [
                        // Colored Box
                        e("div", {
                          style: {
                            width: "16px",
                            height: "16px",
                            backgroundColor: getColorOfName(item.label),
                            marginRight: "8px",
                            flexShrink: 0,
                          },
                        }),
                        // Name
                        item.label,
                      ]
                    )
                  )
                ),
              ]
            ),
          ]
        )
      );
    }
  });
}

async function mountTable(dataManager) {
  const tableContainer = document.getElementById("wrapper");
  const data = await dataManager.getFilteredData();

  if (tableContainer) {
    const root = ReactDOM.createRoot(tableContainer);
    root.render(
      e(CHTCWebComponents.Table, {
        data: Object.values(data).map((dataPoint) => [
          dataPoint.projectName,
          dataPoint.projectInstitutionName,
          dataPoint.osdfFileTransferCount,
          dataPoint.osdfByteTransferCount,
        ]),
        headers: [
          "Name",
          "Institution",
          "Objects Transferred",
          "Bytes Transferred",
        ],
        sortable: true,
        defaultSortColumn: "Objects Transferred",
        defaultSortDirection: "desc",
      })
    );
  }
}

const dataManager = new DataManager();

Promise.all([mountPieCharts(dataManager), mountTable(dataManager)]).catch((e) =>
  console.error(e)
);
