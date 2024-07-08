const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
var fs = require('fs');
const { PassThrough } = require('stream');
const request = require('request');
const prompt = require("prompt-sync")({ sigint: true });


pSelectors = ['ContentTopLevel_ContentPlaceHolder1_lblPlayerName', 'ContentTopLevel_ContentPlaceHolder1_lblHS', 'ContentTopLevel_ContentPlaceHolder1_hl4yearCommit', 
'ContentTopLevel_ContentPlaceHolder1_hlTournamentTeam','ContentTopLevel_ContentPlaceHolder1_lblBestPGGrade', 'ContentTopLevel_ContentPlaceHolder1_lblPos', 'ContentTopLevel_ContentPlaceHolder1_lblHSGrad',
 'ContentTopLevel_ContentPlaceHolder1_lblBT', 'ContentTopLevel_ContentPlaceHolder1_lblAge', 'ContentTopLevel_ContentPlaceHolder1_lblHomeTown', 'ContentTopLevel_ContentPlaceHolder1_lblHt', 'ContentTopLevel_ContentPlaceHolder1_lblWt', 'ContentTopLevel_ContentPlaceHolder1_lblRecentDraftedDate'];

eventSelectors = ['ContentTopLevel_ContentPlaceHolder1_rptEvents_lblEventDate_', 'ContentTopLevel_ContentPlaceHolder1_rptEvents_lblEventWt_', 'ContentTopLevel_ContentPlaceHolder1_rptEvents_lblEventHt_', 'ContentTopLevel_ContentPlaceHolder1_rptEvents_lblFB_', 'ContentTopLevel_ContentPlaceHolder1_rptEvents_lblRange_','ContentTopLevel_ContentPlaceHolder1_rptEvents_lbl60_', 'ContentTopLevel_ContentPlaceHolder1_rptEvents_lblIF_', 'ContentTopLevel_ContentPlaceHolder1_rptEvents_lblOF_', 'ContentTopLevel_ContentPlaceHolder1_rptEvents_lblPop_','ContentTopLevel_ContentPlaceHolder1_rptEvents_lblC_', 'ContentTopLevel_ContentPlaceHolder1_rptEvents_lblPocketRadarExit_'];

pLinkArray = [];

collegeIDDiv1 = ['1750', '1862', '1754', '1756', '1561', '1560', '1562', '1753', '1757', '1563', '1564', '1758', '1565', '1759', '1760', '1751', '1566', '1567', '1878', '1570', '1568', '1569', '35881', '1571', '33894', '1572', '1733', '1574', '1573', '1575', '1576', '1577', '1578', '1579', '1581', '1580', '1583', '1584', '1762', '2981', '36459', '1586', '1587', '1767', '1590', '1589', '36460', '1592', '1593', '1591', '1595', '1769', '1596', '1600', '1599', '1601', '1602', '1603', '1605', '1604', '1771', '33896', '33895', '1606', '36580', '1772', '1917', '1607', '1610', '1608', '1609', '1611', '1612', '1613', '1614', '1773', '1774', '1616', '1617', '1615', '1620', '1618', '1619', '1621', '1622', '1582', '1623', '1624', '1625', '1626', '1775', '1627', '1630', '1629', '1628', '36461', '1938', '1631', '36100', '1777', '1632', '1633', '1635', '1776', '1597', '3157', '1634', '33902', '36075', '1779', '1781', '1780', '2070', '1636', '1638', '1782', '1640', '3203', '1641', '1643', '1642', '1637', '1644', '1645', '1783', '1647', '1784', '1648', '1650', '1649', '1653', '1646', '1654', '1656', '1655', '1657', '1659', '1658', '1652', '1786', '33897', '1787', '1785', '1661', '1660', '1788', '1663', '3215', '1662', '1792', '1664', '1789', '1791', '2050', '1793', '1665', '1794', '1795', '1666', '1667', '1796', '1668', '1797', '1961', '1670', '1671', '1798', '1672', '36462', '36463', '1674', '1669', '1675', '1676', '1799', '1752', '1677', '1673', '1800', '2056', '1802', '1680', '1678', '1681', '1803', '1804', '2058', '1684', '1682', '1683', '1809', '1685', '1810', '33898', '1686', '1811', '1687', '3208', '1980', '3222', '1690', '1689', '1688', '1691', '1812', '1692', '1813', '1695', '1693', '1694', '1814', '1696', '1833', '1815', '1697', '1816', '1817', '1699',
 '1700', '1701', '1698', '33899', '1703', '1639', '1702', '1818', '1705', '1819', '1707', '1704', '1585', '1706', '1711', '1708', '1709', '1820', '1821', '1713', '1714', '1717', '1715', '1718', '3232', '1719', '1712', '1822', '1721', '1824', '1722', '1723', '1825', '1720', '1725', '1823', '1826', '2019', '1727', '1724', '1726', '1728', '1710', '1729', '1736', '1732', '1730', '1731', '1737', '3226', '1742', '2033', '1735', '1739', '1828', '1827', '1734', '1738', '1740', '1830', '1829', '1831', '1832', '1743', '1745', '1744', '1834', '1746', '1748', '1747', '1763', '1755', '1741', '1765', '1766', '1768', '1764', '1761', '33900', '1805', '1806', '1807', '1749', '1808', '2043', '36589', '36602', '2224', '1835', '1770', '1839', '1801', '33901', '1790', '1841', '1840', '1844', '1843', '1836', '3233', '1846', '1842', '1848', '1847', '34088', '1837', '1850', '1851', '1852', '1845', '1849', '1853', '1854', '1598', '1855', '1838', '1856', '1858', '3216', '1859', '3227', '1861', '1857', '1860'];

collegeIDDiv2 = ['1864', '1863', '35552', '1865', '1867', '2040', '1866', '1868', '1869', '2041', '1870', '1871', '1872', '1873', '1874', '2980', '1877', '1875', '1876', '1879', '1880', '2979', '1881', '1882', '1885', '2042', '1887', '1889', '1891', '1892', '1893', '2990', '1894', '1895', '1888', '1896', '1897', '1898', '1884', '1883', '1899', '3113', '34441', '2045', '2044', '1900', '1890', '2046', '2261', '1901', '2262', '1903', '1904', '34961', '1905', '34962', '1902', '3221', '1962', '1906', '1907', '35033', '1908', '1909', '1910', '1911', '1912', '1913', '3130', '2982', '1914', '1915', '1916', '33321', '1918', '1919', '1920', '1921', '1923', '1922', '1924', '3007', '2994', '1925', '1926', '1927', '1928', '2047', '1930', '1931', '1929', '1934', '1933', '1935', '1932', '2287', '33978', '34171', '1937', '1939', '34967', '1940', '1936', '1778', '1942', '1941', '35009', '33889', '1943', '33884', '2048', '35551', '1944', '1945', '1946', '1947', '2302', '1948', '1949', '1651', '1950', '1951', '1952', '1953', '1955', '1954', '3089', '34170', '1956', '1957', '1958', '3145', '2315', '3149', '34218', '2049', '1960', '1959', '1964', '3027', '1966', '1963', '2051', '2052', '1967', '1968', '1969', '2053', '1970', '1971', '2054', '1972', '3101', '2055', '1973', '1974', '2057', '1975', '1965', '2059', '1679', '1976', '1978', '1982', '1979', '1981', '1984', '3116', '1983', '3126', '1985', '1987', '1986', '3117', '1988', '1989', '3121', '3243', '1991', '1990', '1992', '1993', '35499', '1994', '2060', '1996', '1997', '1998', '35189', '2000', '2001', '2984', '2003', '1999', '2002', '2004', '2005', '2008', '2009', '2007', '2010', '2006', '2012', '2013', '35652', '2014', '2011', '2066', '2015', '1716', '3225', '2018', '2067', '2020', '2017', '2016', '2021', '3136', '2022', '2023', '2973', '2024', '2025', '2026', '2028', '2030', '2029', '2031', '2032', '2068', '2034', '2035', '2069', '1995', '2036', '34621', '3153', '2037', '2038', '2039', '1977', '2062', '2061', '2063', '2064', '2027', '3154', '3140', '2071', '2065', '2076', '3118', '2077', '2078', '2080', '3172', '2072', '2081', '2082', '2074', '2073', '2084', '2085', '2086', '2087', '2089', '3085', '2079', '2091', '2092', '33398', '2083', '2461', '2090', '2075', ]

collegeIDDiv3 = ['2241', '2156', '3184', '2157', '2242', '3185', '2158', '2093', '3180', '2245', '2394', '2246', '2160', '2247', '2161', '2248', '2114', '33428', '2249', '2162', '2094', '2395', '2115', '2357', '2250', '2116', '3005', '2164', '2163', '2396', '2251', '2095', '2252', '2117', '2253', '1886', '35496', '2397', '36215', '2254', '2255', '2096', '2257', '2256', '2453', '2097', '2258', '2259', '2118', '2398', '2165', '2399', '1588', '2400', '2166', '2260', '2167', '2263', '2264', '2098', '2168', '2169', '2170', '35393', '2265', '2099', '2266', '2267', '2268', '2171', '2172', '2270', '2402', '2269', '2173', '3006', '2403', '2271', '2174', '2370', '2272', '2457', '2404', '3193', '2119', '2120', '3186', '2121', '2371', '2175', '2274', '2275', '2176', '2177', '2276', '2406', '3181', '2278', '2279', '33989', '2180', '3187', '2280', '2179', '2408', '2100', '2409', '2407', '2282', '3188', '3237', '2284', '2285', '2283', '2122', '2240', '2410', '2182', '2181', '2286', '2184', '2183', '2288', '2124', '2125', '2411', '2185', '2186', '2126', '2290', '2291', '2187', '2292', '2101', '2293', '2294', '2412', '2188', '33972', '2189', '34404', '2190', '2191', '2295', '2123', '2127', '2289', '2192', '2413', '2297', '3217', '2414', '2102', '2193', '2128', '2415', '2296', '2299', '3189', '2298', '2129', '2416', '2239', '2417', '2372', '36585', '2130', '36560', '2301', '33946', '33477', '3182', '2303', '35910', '2304', '2196', '2131', '2306', '2195', '2419', '2418', '2307', '36578', '2308', '2132', '2305', '2373', '2420', '3190', '2310', '2421', '2312', '2314', '2309', '2374', '33386', '2316', '2317', '2103', '2197', '2318', '2313', '2222', '2320', '2375', '2454', '3183', '2321', '2319', '2322', '2422', '2199', '2200', '34169', '2323', '3192', '36109', '2324', '2325', '2201', '2326', '2202', '2328', '2104', '2329', '2133', '2327', '2423', '2455', '2330', '2331', '2425', '3102', '2332', '2426', '2424', '2428', '2427', '2134', '33974', '2333', '2135', '2429', '2335', '2334', '2204', '2205', '33988', '36106', '35425', '2337', '2339', '33940', '2340', '2338', '2341', '2336', '2376', 
'2430', '2343', '2105', '2456', '2344', '2206', '2203', '2136', '2431', '2208', '2345', '2137', '2346', '2347', '2209', '2348', '34025', '2138', '36535', '2342', '2433', '2211', '2349', '2434', '2350', '2351', '36549', '2352', '2212', '2435', '2353', '2377', '2354', '2355', '2213', '2436', '2139', '2140', '2356', '33945', '2358', '2432', '2359', '2215', '2141', '2214', '2142', '2360', '2382', '2365', '2210', '2366', '2439', '2143', '2904', '2903', '2216', '2207', '2364', '2438', '2218', '2217', '2361', '35036', '2363', '2219', '2106', '2225', '2367', '2144', '2440', '2441', '2368', '2220', '2369', '33973', '2145', '2146', '2107', '2221', '2437', '2108', '2148', '2362', '2149', '2443', '2150', '2223', '2151', '2378', '2147', '2444', '35972', '2228', '2448', '2109', '2383', '2229', '2230', '2231', '2110', '2232', '2111', '2449', '2445', '2384', '2233', '2450', '2385', '2386', '2387', '2112', '2451', '2152', '2153', '2234', '2442', '2388', '2154', '3191', '2390', '2088', '36116', '3194', '2391', '2113', '36454', '2236', '35259', '2379', '2226', '2227', '2446', '2380', '2381', '2237', '2155', '2392', '2393', '2447', '2235', '2238']

const whatDivision = prompt("What Division? ");
const GradYear = prompt("Grad Year? ");

division = null;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

switch (whatDivision) {
    case '1':
        division = collegeIDDiv1;
        break;
    case '2':
        division = collegeIDDiv2;
        break;
    case '3':
        division = collegeIDDiv3;
        break;
    default:
        console.log('Warning: You did not specify what division (ex. 3, 2, or 1) defaulting to division 1')
        division = collegeIDDiv1;
}


function setupCSV() {
    var stream = fs.createWriteStream(`../PerfectGameScraper 2.0/Results/${GradYear}/Div${whatDivision}_${GradYear}.txt`);
    stream.once('open', function(fd) {
    stream.write('Name, High School, College, Latest Travel Team, Latest PG Grade, Positions, Graduation Year, Bat/Throws, Age, Hometown, Height, Weight, Draft Round, Division,');

    for (var x = 1; x < 100; x++) {
        stream.write(`Event ${x} Date, Event ${x} Weight, Event ${x} Height, Event ${x} FB, Event ${x} FB-Range, Event ${x} 60, Event ${x} IF, Event ${x} OF, Event ${x} Pop Time, Event ${x} Catcher Velo, Event ${x} Exit Velo,`);
    }
    stream.write('\n');
    stream.end();
});
}

function save(saveData, newLine = false) {
    var stream = fs.createWriteStream(`../PerfectGameScraper 2.0/Results/${GradYear}/Div${whatDivision}_${GradYear}.txt`, {flags: 'a'});
    stream.once('open', function(fd) {
    if(newLine != false) {
        stream.write(saveData + '\n');
        stream.end();
    }
    else {
        
        stream.write(saveData + ', ');
        stream.end();
    }
    
});
}

async function getLinks(collegeID = []) {
    
    for (var cLength = 0; cLength < collegeID.length; cLength++) {
        await sleep(500);
        request({
            method: 'GET',
            url: `https://www.perfectgame.org/College/CollegeCommitments.aspx?Grad=${GradYear}&college=${collegeID[cLength]}`
        }, (err, res, body) => {
            if (err) return console.error(err);
        
            let $ = cheerio.load(body);
    
            playerID = 0o4;
            while (true) {
                try{
                    paddedPlayerID = String(playerID).padStart(2, '0');
                    var playerTag = `#ctl00_ctl00_ContentTopLevel_ContentPlaceHolder1_radgCommitment_ctl00_ctl${paddedPlayerID}_hlPlayerName`;
                    const siteHeading = $(playerTag);
                    
                    pLink = siteHeading.attr('href');          
                    
                    pLink = pLink.split('../')
                    
                    pLinkArray.push(pLink[1]);
                    if(pLink == null) {
                        console.log("broken");
                        console.log(pLinkArray);
                        console.log(pLinkArray.length);
                        break;
                    }
                    playerID += 2;
                } catch (error) {
                    console.log(pLinkArray);
                    console.log(pLinkArray.length);
                    request.delete;
                    break;
                }
            }  
            return pLinkArray.length;
        });
    }
    return;
}



function main(playerSelectors = [], eventSelectors = [], pLinkArray = [], collegeID = []) {
    (async () => {
        setupCSV();
        retLength = await getLinks(collegeIDDiv1);
        retLength2 = await getLinks(collegeIDDiv2);
        retLength3 = await getLinks(collegeIDDiv3);

        const browser = await puppeteer.launch({ 
            headless: false,
        });
        const page = await browser.newPage();

          // Listen for new page creation (new tabs/windows)
        browser.on('targetcreated', async (target) => {
            const newPage = await target.page();
            if (newPage) {
            console.log('New page detected. Closing it.');
            await newPage.close();
            }
        });

        await sleep(12000);
        for (var xs = 0; xs < pLinkArray.length; xs++) {
            try {
                await sleep(2000);
                console.log(`https://www.perfectgame.org/${pLinkArray[xs]}`);
                await page.goto(`https://www.perfectgame.org/${pLinkArray[xs]}`, { waitUntil:'domcontentloaded' }); 
    
                for (var selector = 0; selector < playerSelectors.length; selector++) {
                    try {
                        let pNameID = await page.$(`[id="${playerSelectors[selector]}"]`);
                        let pName = await page.evaluate(el => el.textContent, pNameID);
                        console.log(pName)
                        if (pName.includes(', ') == true) {
                            pName = pName.replaceAll(', ', '/');    
                        }
                        save(pName); 
                    } catch (error) {
                        save('');
                        continue;
                    }
                }

                
                
                await new Promise(r => setTimeout(r, 1500));
                await page.click('[id="ContentTopLevel_ContentPlaceHolder1_lbEvents"]', { waitUntil:'domcontentloaded' });
                await new Promise(r => setTimeout(r, 1500));
                console.log('events clicked');

                var i = 1;
                var x = -1;
                if(xs < retLength)
                {
                    save("Div1");
                }
                else if (xs < retLength2)
                {
                    save("Div2");
                }
                else 
                {
                    save("Div3");
                }
                
                while (true) {
                    try {
                        await page.waitForSelector(`[id="ContentTopLevel_ContentPlaceHolder1_rptEvents_divPlayerEvent_${i}"]`, {timeout: 5000})
                        i++;
                        x++;
                            for (var selectors = 0; selectors < eventSelectors.length; selectors++) {
                                try {
                                    let pNameID = await page.$(`[id="${eventSelectors[selectors] + x}"]`);
                                    let pName = await page.evaluate(el => el.textContent, pNameID);
                                    if (pName.includes(', ') == true) {
                                        pName = pName.replaceAll(', ', ' ');    
                                    }
                                    save(pName); 
                                } catch (error) {
                                    save('');
                                    continue;
                                }
                            }
                    } catch (error) {
                        save('', true);
                        break;
                    }
                }
    
            } catch (error) {
                console.log('something broke', error);
            }   
        }
    })();
}

main(pSelectors, eventSelectors, pLinkArray, division);


