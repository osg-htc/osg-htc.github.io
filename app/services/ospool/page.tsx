import type { Metadata } from 'next';
import ExportedImage from 'next-image-export-optimizer';
import Link from 'next/link';
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import OspoolStats from '@/components/services/OspoolStats';
import { Prose } from './_components/Prose';

export const metadata: Metadata = {
  alternates: { canonical: '/services/ospool' },
  title: 'OSPool — OSG Consortium',
  description:
    'The OSPool is a source of computing capacity accessible to any researcher affiliated with a US academic institution.',
};

const JOB_TABLE: { label: string; ideal: string; ok: string; maybe: string }[] =
  [
    {
      label: 'Expected Throughput, per user',
      ideal: '1000s concurrent cores',
      ok: '100s concurrent cores',
      maybe: "Let's discuss!",
    },
    { label: 'CPU', ideal: '1 per job', ok: '< 12 per job', maybe: '> 12 per job' },
    { label: 'GPU', ideal: '1 per job', ok: '< 4 per job', maybe: '> 4 per job' },
    { label: 'Walltime', ideal: '< 10 hrs*', ok: '< 20 hrs*', maybe: '> 20 hrs' },
    { label: 'RAM', ideal: '< few GB', ok: '< 40 GB', maybe: '> 40 GB' },
    { label: 'Input', ideal: '< 10 GB', ok: '< 40 GB', maybe: '> 40 GB**' },
    { label: 'Output', ideal: '< 10 GB', ok: '< 40 GB', maybe: '> 40 GB**' },
    {
      label: 'Software',
      ideal: 'pre-compiled binaries, containers',
      ok: 'Most other than →',
      maybe: 'Licensed Software, non-Linux',
    },
  ];

export default function Page() {
  return (
    <Box>
      <Container maxWidth='md'>
        <Typography
          variant='h2'
          component='h1'
          textAlign='center'
          fontWeight='bold'
          pt={5}
        >
          OSPool: Serving Open Science throughput computing
        </Typography>
      </Container>

      {/* Live usage statistics */}
      <Box sx={{ bgcolor: 'grey.100', my: 5, py: 2 }}>
        <Container maxWidth='md'>
          <OspoolStats />
          <Box textAlign='center'>
            <Button
              href='/services/ospool/projects'
              variant='contained'
              color='secondary'
            >
              View active OSPool Projects
            </Button>
          </Box>
        </Container>
      </Box>

      <Prose>
        <Typography variant='h3' component='h2' gutterBottom id='what-is-the-ospool'>
          What is the OSPool?
        </Typography>
        <Typography>
          The OSPool is a source of computing capacity that is accessible to any
          researcher affiliated with a US academic institution. Capacity is
          allocated following a Fair-Share policy.
        </Typography>
        <Box textAlign='center' my={3}>
          <Button
            href='https://portal.osg-htc.org/documentation/overview/test-drive-ospool/'
            variant='contained'
            color='secondary'
          >
            Test Drive the OSPool
          </Button>
        </Box>
        <Typography>
          To harness the full capacity of the OSPool you will need to obtain an
          account via the <Link href='https://portal.osg-htc.org'>OSG Portal</Link>.
        </Typography>

        <Typography
          variant='h4'
          component='h2'
          gutterBottom
          mt={4}
          id='how-can-i-harness-the-ospool-capacity'
        >
          How Can I Harness the OSPool Capacity?
        </Typography>
        <Typography>
          Researchers can submit computational work to the OSPool via{' '}
          <Link href='/services/access-point'>
            <strong>Access Points</strong>
          </Link>{' '}
          operated by the OSG, which serves researchers affiliated with projects
          at US-based academic, non-profit, and government institutions.
        </Typography>
        <Paper
          variant='outlined'
          sx={{ bgcolor: 'grey.100', p: 2, my: 4, textAlign: 'center' }}
        >
          <Typography component='span' fontWeight='bold'>
            Sign up for an OSPool account on the
          </Typography>{' '}
          <Button
            href='https://portal.osg-htc.org'
            variant='contained'
            color='secondary'
            size='small'
          >
            OSG Portal
          </Button>
        </Paper>
        <Typography>
          <strong>
            Namely, you can benefit from the OSPool Capacity if you are a
          </strong>
        </Typography>
        <ul>
          <li>
            Researcher affiliated with a project at a US-based academic,
            government, or non-profit institution (via an OSG-Operated Access
            Point).
          </li>
          <li>
            Researcher affiliated with such an institution or project that
            operates a local own access point.
          </li>
        </ul>
        <Typography>
          Institutions or collaborations that would like to harness the capacity
          of the OSPool should contact{' '}
          <Link href='mailto:support@osg-htc.org'>support@osg-htc.org</Link>
        </Typography>
        <Typography>
          <Link href='/services/ospool/projects'>View projects</Link> using the
          OSPool on the OSG Project Page.
        </Typography>

        <Typography
          variant='h4'
          component='h2'
          gutterBottom
          mt={4}
          id='what-types-of-work-run-well-on-the-ospool'
        >
          What types of work run well on the OSPool?
        </Typography>
        <Typography>
          For problems that can be run as numerous, self-contained jobs, the
          OSPool provides computing capacity that can transform the types of
          questions researchers are able to tackle (see the table below). A wide
          range of research problems and computational methods can be broken up
          or otherwise executed in this high-throughput computing (HTC) approach,
          including:
        </Typography>
        <ul>
          <li>image analysis (including MRI, GIS, etc.)</li>
          <li>
            text-based analysis, including DNA read mapping and other
            bioinformatics
          </li>
          <li>parameter sweeps</li>
          <li>
            model optimization approaches, including Monte Carlo methods
          </li>
          <li>
            machine learning and AI executed with multiple independent training
            tasks, different parameters, and/or data subsets
          </li>
        </ul>
        <Typography>
          The OSPool is made up of mostly opportunistic capacity - contributing
          clusters may interrupt jobs at any time. Thus, the OSPool supports
          workloads of numerous jobs that individually complete or checkpoint
          within 20 hours.
        </Typography>
        <Typography>
          <strong>
            Importantly, many compute tasks can take advantage of the OSPool with
            simple modifications, and we’d love to discuss options with you!
          </strong>
        </Typography>
      </Prose>

      <Container maxWidth='md' sx={{ my: 3 }}>
        <TableContainer component={Paper} variant='outlined'>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Ideal Jobs!</TableCell>
                <TableCell>Still very advantageous</TableCell>
                <TableCell>Maybe not, but get in touch!</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {JOB_TABLE.map((row) => (
                <TableRow key={row.label} sx={{ '&:nth-of-type(odd)': { bgcolor: 'grey.50' } }}>
                  <TableCell component='th' sx={{ fontWeight: 'bold' }}>
                    {row.label}
                  </TableCell>
                  <TableCell>{row.ideal}</TableCell>
                  <TableCell>{row.ok}</TableCell>
                  <TableCell>{row.maybe}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      <Prose>
        <Typography>*or checkpointable</Typography>
        <Typography>
          ** per job; you can work with a large dataset on OSG if it can be split
          into pieces
        </Typography>
        <Typography>
          Learn more and chat with a Research Computing Facilitator by{' '}
          <Link href='https://connect.osg-htc.org/'>requesting an account</Link>.
        </Typography>

        <Typography
          variant='h4'
          component='h2'
          gutterBottom
          mt={4}
          id='learning-to-use-the-ospool'
        >
          Learning to use the OSPool
        </Typography>
        <Typography>
          We have a complete{' '}
          <Link href='https://portal.osg-htc.org/documentation/'>
            knowledge base of user documentation
          </Link>{' '}
          and an active and supportive{' '}
          <Link href='https://portal.osg-htc.org/documentation/support_and_training/support/getting-help-from-RCFs/'>
            facilitation team
          </Link>
          , who support all users on OSG-Operated Access Points.
        </Typography>
        <Typography>
          Users submitting jobs can specify their own requirements for per-job
          compute resources (e.g. CPU cores, memory, etc.) and any special server
          requirements. We recommend submitting lots of jobs and taking advantage
          of all the cycles possible, wherever they may be. We cannot guarantee
          that any single job will finish quickly, but the OSPool will allow you
          to accomplish a tremendous amount of work across jobs.
        </Typography>

        <Typography
          variant='h4'
          component='h2'
          gutterBottom
          mt={4}
          id='who-contributes-capacity-to-the-ospool'
        >
          Who contributes capacity to the OSPool?
        </Typography>
        <Typography>
          The computing resources for the OSPool are contributed by members of
          the OSG Compute Federation, typically campuses, government-supported
          supercomputing centers, and research collaborations. The members
          individually determine their policies for contributing resources,
          including the amount of resources it contributes and when these
          resources are available. In addition, some resource providers decide to
          share their resources with specific research projects, or they may
          choose to contribute resources to all in the OSPool.
        </Typography>
        <Typography>
          View institution contributions on our{' '}
          <Link href='/services/ospool/institutions'>Institutions Page</Link>.
        </Typography>
      </Prose>

      {/* Powered-by / operated-by logos */}
      <Container maxWidth='lg' sx={{ pb: 5 }}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 4,
            mt: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Link href='https://htcondor.org/'>
              <ExportedImage
                src='/images/logos/HTCondor_Logo.png'
                alt='HTCondor Logo'
                width={5351}
                height={1684}
                style={{ width: 80, height: 'auto' }}
              />
            </Link>
            <Typography variant='h5' component='p'>
              Powered By <Link href='https://htcondor.org/'>HTCondor</Link>
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Link href='https://path-cc.io'>
              <ExportedImage
                src='/images/logos/Logo_Round_Med.png'
                alt='PATh Logo'
                width={300}
                height={300}
                style={{ width: 80, height: 'auto' }}
              />
            </Link>
            <Typography variant='h5' component='p'>
              Operated by <Link href='https://path-cc.io'>PATh</Link>
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Link href='/services/ospool'>
            <ExportedImage
              src='/images/logos/OSPool_Logo.png'
              alt='OSPool Logo'
              width={3544}
              height={3530}
              style={{ width: 320, height: 'auto' }}
            />
          </Link>
        </Box>
      </Container>
    </Box>
  );
}
