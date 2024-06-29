const fUtil = require("../misc/file");
const stuff = require("./info");
const http = require("http");

function toAttrString(table) {
	return typeof table == "object"
		? Object.keys(table)
				.filter((key) => table[key] !== null)
				.map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(table[key])}`)
				.join("&")
		: table.replace(/"/g, '\\"');
}
function toParamString(table) {
	return Object.keys(table)
		.map((key) => `<param name="${key}" value="${toAttrString(table[key])}">`)
		.join(" ");
}
function toObjectString(attrs, params) {
	return `<object id="obj" ${Object.keys(attrs)
		.map((key) => `${key}="${attrs[key].replace(/"/g, '\\"')}"`)
		.join(" ")}>${toParamString(params)}</object>`;
}

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	if (req.method != "GET") return;
	const query = url.query;

	var attrs, params, title;
	switch (url.pathname) {
		case "/cc_browser": {
			title = "CC Browser";
			attrs = {
				data: process.env.SWF_URL + "/cc_browser.swf", // data: 'cc_browser.swf',
				type: "application/x-shockwave-flash",
				id: "char_creator",
				width: "960",
				height: "1200",
			};
			params = {
				flashvars: {
					apiserver: "/",
					storePath: process.env.STORE_URL + "/<store>",
					clientThemePath: process.env.CLIENT_URL + "/<client_theme>",
					original_asset_id: query["id"] || null,
					themeId: "family",
					ut: 60,
					appCode: "go",
					page: "",
					siteId: "school",
					m_mode: "school",
					isLogin: "Y",
					isEmbed: 0,
					ctc: "go",
					tlang: "en_US",
					lid: 13,
				},
				allowScriptAccess: "always",
				movie: process.env.SWF_URL + "/cc_browser.swf", // 'cc_browser.swf'
			};
			break;
		}

		default:
			return;
	}
	res.setHeader("Content-Type", "text/html; charset=UTF-8");
	Object.assign(params.flashvars, query);
	res.end(`
	<head>
    <script>document.title='${title}',flashvars=${JSON.stringify(
	params.flashvars
	)}</script><link rel="stylesheet" type="text/css" href="/html/css/common_combined.css.gz.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato:400,700">
    <link rel="stylesheet" href="/html/css/cc.css.gz.css">
    <script href="/html/js/common_combined.js.gz.js"></script>
    </head>
    <body>
    <nav class="navbar site-nav" role="navigation">
    <div class="container">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-ex1-collapse">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
              </button>
            <a class="navbar-brand" href="/m/movies" title="GoAnimate For Schools">
                <img src="/html/img/logo.png" alt="GoAnimate For Schools">
            </a>
        </div>
    
        <ul class="nav site-nav-alert-nav hidden-xs">
            <li>
                <a href="/messages" title="Messages"><span class="glyphicon glyphicon-envelope"></span><span class="count"></span></a>
            </li>
            <li>
                <a href="/notifications" title="Notifications"><span class="glyphicon glyphicon-bell"></span><span class="count"></span></a>
            </li>
        </ul>
        <div class="collapse navbar-collapse navbar-ex1-collapse">
            <ul class="nav navbar-nav navbar-right">
                <li class="dropdown">
                    <a class="dropdown-toggle" href="#" data-toggle="dropdown">Your Account <span class="caret"></span></a>
                    <ul class="dropdown-menu">
                        <li><a href="/student">Dashboard</a></li>
                        <li><a href="/dashboard/videos">Your Videos</a></li>
                        <li class="divider"></li>
                        <li><a href="/account">Account Settings</a></li>
                        <li><a href="/profile/you">Your Profile</a></li>
                        <li class="divider"></li>
                        <li><a class="logout-link" href="/logoff">Logout</a></li>
                    </ul>
                </li><li class="dropdown">
                    <a class="dropdown-toggle" href="#" data-toggle="dropdown">Explore <span class="caret"></span></a>
                    <ul class="dropdown-menu">
                        <li><a href="/students">Students</a></li>
                        <li><a href="/teachers">Teachers</a></li>
                        <li><a href="/videos">Videos</a></li>
                        <li><a href="/public_faq">FAQ</a></li>
                    </ul>
                </li>
                <li>
                <a class="hidden-sm hidden-md hidden-lg" href="/c/create">Make a Video</a>
                <span class="site-nav-btn hidden-xs"><a class="btn btn-green" href="/c/create">Make a Video</a></span>
                </li>
            </ul>
        </div>
    </div>
    </nav>
    <div class="container container-cc">
      <ul class="breadcrumb">
                <li><a href="/c/create">Make a video</a></li>
                <li class="active">Your Characters</li>
            </ul>
    
            <p>Browse characters already available in your theme and use them as a starting point to create new custom characters.</p>
    
    <div id="ccbrowser-container" align="center">
    ${toObjectString(attrs, params)}
    </div>
    </div>
    <footer class="site-footer hidden-print">
    <div class="container">
                <div class="row site-footer-nav">
            <div class="col-sm-3">
                <div class="site-footer-nav-col">
                    <h5>About GoAnimate</h5>
                    <ul class="list-unstyled">
                        <li><a href="https://web.archive.org/web/20161231134647/http://goanimate.com/about">Who We Are</a></li>
                        <li><a href="https://web.archive.org/web/20161231134647/http://goanimate.com/contactus">Contact Us</a></li>
                        <li><a href="https://web.archive.org/web/20161231134647/http://goanimate.com/video-maker-tips">Blog</a></li>
                        <li><a href="https://web.archive.org/web/20161231134647/http://press.goanimate.com/">Press</a></li>
                    </ul>
                </div>
            </div>

            <div class="col-sm-3">
                <div class="site-footer-nav-col">
                    <h5>GoAnimate Solutions</h5>
                    <ul class="list-unstyled">
                        <li><a href="https://web.archive.org/web/20161231134647/http://goanimate4schools.com/" target="_blank">GoAnimate for Schools</a></li>
                        <li class="hidden-xs">&nbsp;</li>
                        <li class="hidden-xs">&nbsp;</li>
                        <li class="hidden-xs">&nbsp;</li>
                    </ul>
                </div>
            </div>

            <div class="col-sm-3">
                <div class="site-footer-nav-col">
                    <h5>Usage Guidelines</h5>
                    <ul class="list-unstyled">
                        <li><a href="/web/20161231134647/https://goanimate4schools.com/termsofuse">Terms of Service</a></li>
                        <li><a href="/web/20161231134647/https://goanimate4schools.com/privacy">Privacy Policy</a></li>
                        <li class="hidden-xs">&nbsp;</li>
                        <li class="hidden-xs">&nbsp;</li>
                    </ul>
                </div>
            </div>

            <div class="col-sm-3">
                <div class="site-footer-nav-col">
                    <h5>Getting Help</h5>
                    <ul class="list-unstyled">
                        <li><a href="https://web.archive.org/web/20161231134647/http://blog.goanimate4schools.com/">Educator Experiences</a></li>
                        <li><a href="https://web.archive.org/web/20161231134647/https://goanimate4schools.zendesk.com/hc/en-us">Help Center</a></li>
                        <li class="hidden-xs">&nbsp;</li>
                        <li class="hidden-xs">&nbsp;</li>
                    </ul>
                </div>
            </div>
        </div>
        <hr/>

        <div class="row site-footer-copyright">
            <div class="col-sm-6">
                <div class="site-footer-socials-container">
                    Follow us on:
                    <ul class="site-footer-socials clearfix">
                        <li><a class="facebook" href="https://web.archive.org/web/20161231134647/https://www.facebook.com/GoAnimateInc">Facebook</a></li>
                        <li><a class="twitter" href="https://web.archive.org/web/20161231134647/https://twitter.com/Go4Schools">Twitter</a></li>
                        <li><a class="linkedin" href="https://web.archive.org/web/20161231134647/https://www.linkedin.com/company/goanimate">Linked In</a></li>
                        <li><a class="gplus" href="https://web.archive.org/web/20161231134647/https://plus.google.com/+goanimate">Google+</a></li>
                        <li><a class="youtube" href="https://web.archive.org/web/20161231134647/https://www.youtube.com/user/GoAnimate">YouTube</a></li>
                    </ul>
                </div>
            </div>
            <div class="col-sm-6">
                <div class="pull-right">
                    <span class="site-footer-norton">
                      <script type="text/javascript" src="https://web.archive.org/web/20161231134647js_/https://seal.websecurity.norton.com/getseal?host_name=goanimate.com&amp;size=S&amp;use_flash=NO&amp;use_transparent=YES&amp;lang=en"></script>
                    </span>
                    <img src="https://web.archive.org/web/20161231134647im_/https://d2qrjeyl4jwu9j.cloudfront.net/static/766ffff01a7a3e3a/school/img/site/logo_amazon.png" alt="AWS Partner Network"/>
                    &nbsp;&nbsp;&nbsp;
                    GoAnimate &copy; 2024
                </div>
            </div>
        </div>

    </div>
</footer>


<div id="studio_container" style="display: none;">
    <div id="studio_holder"><!-- Full Screen Studio -->
        <div style="top: 50%; position: relative;">
            This content requires the Adobe Flash Player 10.3. <a href="https://web.archive.org/web/20161231134647/http://get.adobe.com/flashplayer/">Get Flash</a>
        </div>
    </div>
</div>

<!-- Start of Async HubSpot Analytics Code -->
  <script type="text/javascript">
    (function(d,s,i,r) {
      if (d.getElementById(i)){return;}
      var n=d.createElement(s),e=d.getElementsByTagName(s)[0];
      n.id=i;n.src='//web.archive.org/web/20161231134647/https://js.hs-analytics.net/analytics/'+(Math.ceil(new Date()/r)*r)+'/491659.js';
      e.parentNode.insertBefore(n, e);
    })(document,"script","hs-analytics",300000);
  </script>
<!-- End of Async HubSpot Analytics Code -->

<!-- SharpSpring begin -->
<script type="text/javascript">
var _ss = _ss || [];
_ss.push(['_setDomain', 'https://web.archive.org/web/20161231134647/https://koi-3q6b8sg59e.marketingautomation.services/net']);
_ss.push(['_setAccount', 'KOI-1OTR0IV8I']);
_ss.push(['_trackPageView']);
(function() {
    var ss = document.createElement('script');
    ss.type = 'text/javascript'; ss.async = true;

    ss.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'koi-3Q6B8SG59E.marketingautomation.services/client/ss.js?ver=1.1.1';
    var scr = document.getElementsByTagName('script')[0];
    scr.parentNode.insertBefore(ss, scr);
})();
</script>
<!-- SharpSpring end -->

</body>
</html>
