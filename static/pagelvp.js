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
		case "/player": {
			title = "Your Animation";
			attrs = {
				data: process.env.SWF_URL + "/player.swf",
				type: "application/x-shockwave-flash",
				width: "100%",
				height: "100%",
			};
			params = {
				flashvars: {
					apiserver: "/",
					storePath: process.env.STORE_URL + "/<store>",
					ut: 30,
					thumbnailURL: "http://localhost/movie_thumbs/${mId}.png",
					isEmbed: 1,
					autostart: 0,
					isWide: 1,
					clientThemePath: process.env.CLIENT_URL + "/<client_theme>",
				},
				allowScriptAccess: "always",
				allowFullScreen: "true",
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
	<link rel="stylesheet" type="text/css" href="/html/css/common_combined.css.gz.css">
	<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato:400,700">
	<link rel="stylesheet" href="/html/css/movie.css.gz.css">
	<script href="/html/js/common_combined.js.gz.js"></script>
	<script>document.title='${title}',flashvars=${JSON.stringify(
		params.flashvars
	)}</script>
	</head>
	<body style="margin:0px">
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
							<li><a href="/you">Dashboard</a></li>
							<li><a href="/dashboard/videos">Your Videos</a></li>
							<li class="divider"></li>
							<li><a href="/account">Account Settings</a></li>
							<li><a href="/profile">Your Profile</a></li>
							<li class="divider"></li>
							<li><a class="logout-link" href="/logoff">Logout</a></li>
						</ul>
					</li><li class="dropdown">
						<a class="dropdown-toggle" href="#" data-toggle="dropdown">Explore <span class="caret"></span></a>
						<ul class="dropdown-menu">
							<li><a href="/students">Students</a></li>
							<li><a href="/teachers">Teachers</a></li>
							<li><a href="/dashboard/videos">Videos</a></li>
							<li class="divider"></li>
							<li><a href="https://discord.gg/bb8xXaWPv3">Educator Experiences</a></li>
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
	<div id="video-page">
	<div class="video-top">
		<div class="container">
			<div class="row">
				<div class="col-sm-6 video-left">
					<div class="status-container">
						<div class="vthumb-container">
							<div class="vthumb">
								<div class="vthumb-clip"><div class="vthumb-clip-inner"><span class="valign"></span><img src="https://flashthemes.net/movie_thumbs/thumb-0KwcYC3zy0.png" alt="Test"></div></div>
							</div>
						</div>
					</div>
					<div class="video-top-content clearfix">
						<div class="pull-left video-info">
							<h1>Test</h1>
							By <a title="You">You</a>                     </div>
						<div class="video-top-status">
								</div>
					</div>
				</div>
				
			</div>
		</div>
	</div>
	<div class="video-main">
	<div class="container">
			<div class="video-main-content">
				<div class="video-header clearfix noshow">
				</div>
	
				<div class="video-content">
					<div class="player-container">
	<meta name="medium" content="video">
	<div style="position:relative">
		<div id="playerdiv" align="center" style="width:620px;height:349px;">
	${toObjectString(attrs, params)}
	</div>
		</div>
	
					</div>
				</div>
				
	<script>
	$('.video-actions').toggle($('.video-actions').find('.btn').length > 0);
	</script>
	
	
				
			</div>
			<div class="video-main-aside" id="player-aside"></div>
	
	</div>
	</div>
	<div class="container main-container">
		<div class="row">
			<div class="col-md-8">
				<ul class="nav nav-tabs">
					<li class="active"><a href="#video-info" data-toggle="tab">More Info</a></li>
				</ul>
	
				<div class="tab-content">
					<div class="tab-pane active" id="video-info">
						<p class="inside">Published on: 17 Nov 2024</p>
						<p></p>
					</div>
				</div>
			</div>
			<div class="col-md-4 aside video-aside">
	
				<div></div><br>
	
			</div>
		</div>
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
