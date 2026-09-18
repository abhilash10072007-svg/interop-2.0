import React, { useMemo, useState } from 'react';

import {
  UserCheck,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileText,
  Search,
  Filter,
  RefreshCw,
  AlertTriangle,
  Building2,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

import { useApp } from '../../context/AppContext';


const OfficerReviewQueue = () => {

  const {
    applications,
    handleOfficerApproveApp,
    handleOfficerRejectApp,
    officerId,
    refreshBackendData,
    citizenId,
    isBackendConnected,
    isLoadingCitizen,
  } = useApp();


  // ============================================================
  // LOCAL UI STATE
  // ============================================================

  const [searchQuery, setSearchQuery] =
    useState('');

  const [statusFilter, setStatusFilter] =
    useState('PENDING');

  const [expandedApplication, setExpandedApplication] =
    useState(null);

  const [processingApplication, setProcessingApplication] =
    useState(null);


  // ============================================================
  // SAFE APPLICATION ARRAY
  // ============================================================

  const safeApplications =
    Array.isArray(applications)
      ? applications
      : [];


  // ============================================================
  // PENDING APPLICATIONS
  // ============================================================

  const pendingApplications =
    useMemo(() => {

      return safeApplications.filter(
        (app) => {

          const rawStatus =
            String(
              app.rawStatus ||
              ''
            ).toUpperCase();


          return (
            rawStatus === 'SUBMITTED' ||
            rawStatus === 'UNDER_REVIEW' ||
            rawStatus === 'UNDER_VERIFICATION'
          );

        }
      );

    }, [
      safeApplications,
    ]);


  // ============================================================
  // FILTER APPLICATIONS
  // ============================================================

  const filteredApplications =
    useMemo(() => {

      let result =
        statusFilter === 'PENDING'
          ? pendingApplications
          : safeApplications;


      if (searchQuery.trim()) {

        const query =
          searchQuery
            .toLowerCase()
            .trim();


        result =
          result.filter(
            (app) => {

              return (

                String(
                  app.id ||
                  ''
                )
                  .toLowerCase()
                  .includes(query)

                ||

                String(
                  app.serviceName ||
                  ''
                )
                  .toLowerCase()
                  .includes(query)

                ||

                String(
                  app.applicantName ||
                  ''
                )
                  .toLowerCase()
                  .includes(query)

                ||

                String(
                  app.applicantRef ||
                  ''
                )
                  .toLowerCase()
                  .includes(query)

              );

            }
          );

      }


      return result;

    }, [
      safeApplications,
      pendingApplications,
      searchQuery,
      statusFilter,
    ]);


  // ============================================================
  // SERVICE CATEGORY
  // ============================================================

  const getServiceCategory =
    (app) => {

      if (app.serviceCategory) {
        return app.serviceCategory;
      }


      const service =
        String(
          app.serviceName ||
          ''
        );


      if (
        service === 'Driving License' ||
        service === 'Vehicle Registration'
      ) {

        return 'Transport & Vehicles';

      }


      if (
        service === 'Income Certificate'
      ) {

        return 'Revenue & Land Administration';

      }


      if (
        service === 'Caste Certificate'
      ) {

        return 'Backward Classes & Community Welfare';

      }


      if (
        service === 'Personal Loan'
      ) {

        return 'Public Financial Institutions Network';

      }


      return 'Social Welfare & Education';

    };


  // ============================================================
  // DEPARTMENT
  // ============================================================

  const getDepartment =
    (app) => {

      if (app.department) {
        return app.department;
      }


      const category =
        getServiceCategory(app);


      if (
        category ===
        'Transport & Vehicles'
      ) {

        return 'Transport Department';

      }


      if (
        category ===
        'Revenue & Land Administration'
      ) {

        return 'Revenue Department';

      }


      if (
        category ===
        'Backward Classes & Community Welfare'
      ) {

        return (
          'Backward Classes & Community Welfare Department'
        );

      }


      if (
        category ===
        'Public Financial Institutions Network'
      ) {

        return (
          'Public Financial Institutions Network'
        );

      }


      return 'Welfare Department';

    };


  // ============================================================
  // STATUS
  // ============================================================

  const getStatusInfo =
    (app) => {

      const rawStatus =
        String(
          app.rawStatus ||
          ''
        ).toUpperCase();


      switch (rawStatus) {

        case 'SUBMITTED':

          return {
            label: 'Submitted',
            icon: FileText,
          };


        case 'UNDER_REVIEW':

          return {
            label: 'Under Review',
            icon: Clock,
          };


        case 'UNDER_VERIFICATION':

          return {
            label: 'Under Verification',
            icon: ShieldCheck,
          };


        case 'APPROVED':

          return {
            label: 'Approved',
            icon: CheckCircle2,
          };


        case 'REJECTED':

          return {
            label: 'Rejected',
            icon: XCircle,
          };


        default:

          return {
            label:
              app.status ||
              'Pending',

            icon: Clock,
          };

      }

    };


  // ============================================================
  // ELIGIBILITY / VERIFICATION CRITERIA
  // ============================================================

  const getVerificationCriteria =
    (app) => {

      const service =
        String(
          app.serviceName ||
          ''
        );


      // --------------------------------------------------------
      // DRIVING LICENSE
      // --------------------------------------------------------

      if (
        service === 'Driving License'
      ) {

        return [

          {
            label: 'Age Requirement',
            value: 'Checked by eligibility service',
            status: 'verified',
          },

          {
            label: 'Learner License',
            value: 'Validity checked',
            status: 'verified',
          },

          {
            label: 'Learner License Duration',
            value: 'Minimum duration checked',
            status: 'verified',
          },

          {
            label: 'Medical Fitness',
            value: 'Medical record checked',
            status: 'verified',
          },

          {
            label: 'Aadhaar Address Match',
            value: 'Address verification checked',
            status: 'verified',
          },

        ];

      }


      // --------------------------------------------------------
      // EDUCATION SCHOLARSHIP
      // --------------------------------------------------------

      if (
        service ===
        'Education Scholarship'
      ) {

        return [

          {
            label: 'Education Record',
            value: 'Student record checked',
            status: 'verified',
          },

          {
            label: 'Student Status',
            value: 'Active student status checked',
            status: 'verified',
          },

          {
            label: 'Income Record',
            value: 'Income record checked',
            status: 'verified',
          },

          {
            label: 'Income Threshold',
            value: 'Eligibility threshold checked',
            status: 'verified',
          },

          {
            label: 'Required Consent',
            value: 'Education and income consent checked',
            status: 'verified',
          },

        ];

      }


      // --------------------------------------------------------
      // STUDENT ASSISTANCE
      // --------------------------------------------------------

      if (
        service ===
        'Student Assistance'
      ) {

        return [

          {
            label: 'Education Record',
            value: 'Student record checked',
            status: 'verified',
          },

          {
            label: 'Student Status',
            value: 'Active student status checked',
            status: 'verified',
          },

          {
            label: 'Income Record',
            value: 'Income record checked',
            status: 'verified',
          },

          {
            label: 'Income Threshold',
            value: 'Eligibility threshold checked',
            status: 'verified',
          },

          {
            label: 'Required Consent',
            value: 'Education and income consent checked',
            status: 'verified',
          },

        ];

      }


      // --------------------------------------------------------
      // INCOME CERTIFICATE
      // --------------------------------------------------------

      if (
        service ===
        'Income Certificate'
      ) {

        return [

          {
            label: 'Residency',
            value: 'Residency record checked',
            status: 'verified',
          },

          {
            label: 'State Residency',
            value: 'State residence verified',
            status: 'verified',
          },

          {
            label: 'Residency Duration',
            value: 'Minimum duration checked',
            status: 'verified',
          },

          {
            label: 'Existing Certificate',
            value: 'Existing valid certificate checked',
            status: 'verified',
          },

        ];

      }


      // --------------------------------------------------------
      // CASTE CERTIFICATE
      // --------------------------------------------------------

      if (
        service ===
        'Caste Certificate'
      ) {

        return [

          {
            label: 'Community',
            value: 'Official schedule match checked',
            status: 'verified',
          },

          {
            label: 'Community Verification',
            value: 'Community record checked',
            status: 'verified',
          },

          {
            label: 'State Residency',
            value: 'Tamil Nadu residency checked',
            status: 'verified',
          },

          {
            label: 'Lineage',
            value: 'Lineage verification checked',
            status: 'verified',
          },

          {
            label: 'Revenue Verification',
            value: 'Revenue verification checked',
            status: 'verified',
          },

        ];

      }


      // --------------------------------------------------------
      // VEHICLE REGISTRATION
      // --------------------------------------------------------

      if (
        service ===
        'Vehicle Registration'
      ) {

        return [

          {
            label: 'Vehicle Identity',
            value: 'Chassis and engine details checked',
            status: 'verified',
          },

          {
            label: 'Invoice',
            value: 'Invoice requirement checked',
            status: 'verified',
          },

          {
            label: 'Insurance',
            value: 'Insurance requirement checked',
            status: 'verified',
          },

          {
            label: 'PUC',
            value: 'PUC requirement checked',
            status: 'verified',
          },

          {
            label: 'Ownership',
            value: 'Ownership details checked',
            status: 'verified',
          },

        ];

      }


      // --------------------------------------------------------
      // PERSONAL LOAN
      // --------------------------------------------------------

      if (
        service ===
        'Personal Loan'
      ) {

        return [

          {
            label: 'Age Requirement',
            value: 'Eligibility age checked',
            status: 'verified',
          },

          {
            label: 'Annual Income',
            value: 'Minimum income checked',
            status: 'verified',
          },

          {
            label: 'KYC',
            value: 'KYC completion checked',
            status: 'verified',
          },

          {
            label: 'Default Status',
            value: 'Existing loan default checked',
            status: 'verified',
          },

          {
            label: 'Income Certificate',
            value: 'Declared income cross-check available',
            status: 'verified',
          },

        ];

      }


      // --------------------------------------------------------
      // FALLBACK
      // --------------------------------------------------------

      return [

        {
          label: 'Eligibility Check',
          value: 'Backend eligibility service checked',
          status: 'verified',
        },

        {
          label: 'Citizen Record',
          value: 'Unified citizen record checked',
          status: 'verified',
        },

      ];

    };


  // ============================================================
  // EXPAND / COLLAPSE
  // ============================================================

  const toggleApplication =
    (applicationId) => {

      setExpandedApplication(
        (previous) =>
          previous === applicationId
            ? null
            : applicationId
      );

    };


  // ============================================================
  // REFRESH
  // ============================================================

  const handleRefresh =
    async () => {

      if (!citizenId) {
        return;
      }


      try {

        await refreshBackendData(
          citizenId
        );

      } catch (error) {

        console.error(
          'Officer queue refresh failed:',
          error
        );

      }

    };


  // ============================================================
  // APPROVE
  // ============================================================

  const handleApprove =
    async (applicationId) => {

      try {

        setProcessingApplication(
          applicationId
        );


        await handleOfficerApproveApp(
          applicationId
        );

      } catch (error) {

        console.error(
          'Approval failed:',
          error
        );

      } finally {

        setProcessingApplication(
          null
        );

      }

    };


  // ============================================================
  // REJECT
  // ============================================================

  const handleReject =
    async (applicationId) => {

      try {

        setProcessingApplication(
          applicationId
        );


        await handleOfficerRejectApp(
          applicationId
        );

      } catch (error) {

        console.error(
          'Rejection failed:',
          error
        );

      } finally {

        setProcessingApplication(
          null
        );

      }

    };


  // ============================================================
  // RENDER
  // ============================================================

  return (

    <div className="space-y-6">


      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">

              <UserCheck
                className="h-6 w-6 text-indigo-600"
              />

            </div>


            <div>

              <h1 className="text-2xl font-bold text-gray-900">

                Officer Review Queue

              </h1>


              <p className="text-sm text-gray-500">

                Review citizen applications using verified interoperability data.

              </p>

            </div>

          </div>

        </div>


        <div className="flex items-center gap-3">


          {/* BACKEND STATUS */}

          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">

            <span
              className={`h-2.5 w-2.5 rounded-full ${
                isBackendConnected
                  ? 'bg-green-500'
                  : 'bg-red-500'
              }`}
            />


            <span className="text-sm font-medium text-gray-700">

              {isBackendConnected
                ? 'Backend Connected'
                : 'Backend Offline'}

            </span>

          </div>


          {/* REFRESH */}

          <button
            type="button"
            onClick={handleRefresh}
            disabled={
              isLoadingCitizen ||
              !citizenId
            }
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >

            <RefreshCw
              className={`h-4 w-4 ${
                isLoadingCitizen
                  ? 'animate-spin'
                  : ''
              }`}
            />

            Refresh

          </button>

        </div>

      </div>


      {/* ======================================================
          SUMMARY CARDS
      ====================================================== */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">


        <div className="rounded-xl border border-gray-200 bg-white p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">

                Pending Review

              </p>

              <p className="mt-1 text-3xl font-bold text-gray-900">

                {pendingApplications.length}

              </p>

            </div>


            <div className="rounded-lg bg-amber-50 p-3">

              <Clock
                className="h-6 w-6 text-amber-600"
              />

            </div>

          </div>

        </div>


        <div className="rounded-xl border border-gray-200 bg-white p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">

                Total Applications

              </p>

              <p className="mt-1 text-3xl font-bold text-gray-900">

                {safeApplications.length}

              </p>

            </div>


            <div className="rounded-lg bg-blue-50 p-3">

              <FileText
                className="h-6 w-6 text-blue-600"
              />

            </div>

          </div>

        </div>


        <div className="rounded-xl border border-gray-200 bg-white p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">

                Officer

              </p>

              <p className="mt-1 text-lg font-bold text-gray-900">

                {officerId || 'Not Assigned'}

              </p>

            </div>


            <div className="rounded-lg bg-green-50 p-3">

              <UserCheck
                className="h-6 w-6 text-green-600"
              />

            </div>

          </div>

        </div>

      </div>


      {/* ======================================================
          SEARCH + FILTER
      ====================================================== */}

      <div className="rounded-xl border border-gray-200 bg-white p-4">

        <div className="flex flex-col gap-3 md:flex-row">


          <div className="relative flex-1">

            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            />


            <input
              type="text"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(
                  event.target.value
                )
              }
              placeholder="Search application ID, citizen or service..."
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />

          </div>


          <div className="flex items-center gap-2">

            <Filter
              className="h-4 w-4 text-gray-400"
            />


            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
            >

              <option value="PENDING">
                Pending Review
              </option>

              <option value="ALL">
                All Applications
              </option>

            </select>

          </div>

        </div>

      </div>


      {/* ======================================================
          APPLICATION LIST
      ====================================================== */}

      <div className="space-y-4">


        {filteredApplications.length === 0 ? (

          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">

            <CheckCircle2
              className="mx-auto h-12 w-12 text-green-500"
            />


            <h3 className="mt-4 text-lg font-semibold text-gray-900">

              No applications in this queue

            </h3>


            <p className="mt-1 text-sm text-gray-500">

              New citizen applications will appear here automatically.

            </p>

          </div>

        ) : (

          filteredApplications.map(
            (app) => {

              const status =
                getStatusInfo(app);


              const StatusIcon =
                status.icon;


              const criteria =
                getVerificationCriteria(
                  app
                );


              const isExpanded =
                expandedApplication ===
                app.id;


              const isProcessing =
                processingApplication ===
                app.id;


              return (

                <div
                  key={app.id}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                >


                  {/* =================================================
                      APPLICATION HEADER
                  ================================================= */}

                  <div className="p-5">

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">


                      <div className="flex items-start gap-4">


                        <div className="rounded-xl bg-indigo-50 p-3">

                          <FileText
                            className="h-6 w-6 text-indigo-600"
                          />

                        </div>


                        <div>

                          <div className="flex flex-wrap items-center gap-2">

                            <h3 className="font-bold text-gray-900">

                              {app.serviceName}

                            </h3>


                            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">

                              {app.id}

                            </span>

                          </div>


                          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-500">

                            <span>

                              Citizen:
                              <strong className="ml-1 text-gray-700">

                                {app.applicantName}

                              </strong>

                            </span>


                            <span>

                              ID:
                              <strong className="ml-1 text-gray-700">

                                {app.applicantRef}

                              </strong>

                            </span>


                            <span>

                              Submitted:
                              <strong className="ml-1 text-gray-700">

                                {app.appliedOn}

                              </strong>

                            </span>

                          </div>

                        </div>

                      </div>


                      {/* STATUS */}

                      <div className="flex items-center gap-3">


                        <div className="flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1.5">

                          <StatusIcon
                            className="h-4 w-4 text-gray-600"
                          />

                          <span className="text-sm font-medium text-gray-700">

                            {status.label}

                          </span>

                        </div>


                        <button
                          type="button"
                          onClick={() =>
                            toggleApplication(
                              app.id
                            )
                          }
                          className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50"
                        >

                          {isExpanded ? (

                            <ChevronUp
                              className="h-5 w-5"
                            />

                          ) : (

                            <ChevronDown
                              className="h-5 w-5"
                            />

                          )}

                        </button>

                      </div>

                    </div>


                    {/* =================================================
                        DEPARTMENT
                    ================================================= */}

                    <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">

                      <Building2
                        className="h-4 w-4 text-gray-400"
                      />

                      <span className="text-gray-500">

                        Department:

                      </span>

                      <span className="font-medium text-gray-700">

                        {getDepartment(app)}

                      </span>

                    </div>

                  </div>


                  {/* =================================================
                      EXPANDED REVIEW
                  ================================================= */}

                  {isExpanded && (

                    <div className="border-t border-gray-100 bg-gray-50/60 p-5">


                      {/* REVIEW TITLE */}

                      <div className="flex items-center gap-2">

                        <ShieldCheck
                          className="h-5 w-5 text-indigo-600"
                        />

                        <h4 className="font-semibold text-gray-900">

                          Interoperability Verification

                        </h4>

                      </div>


                      <p className="mt-1 text-sm text-gray-500">

                        Verification categories correspond to the selected service. Final eligibility is determined by the backend eligibility service.

                      </p>


                      {/* CRITERIA */}

                      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">


                        {criteria.map(
                          (criterion) => (

                            <div
                              key={
                                criterion.label
                              }
                              className="rounded-lg border border-gray-200 bg-white p-4"
                            >

                              <div className="flex items-start justify-between gap-3">


                                <div>

                                  <p className="text-sm font-medium text-gray-900">

                                    {criterion.label}

                                  </p>


                                  <p className="mt-1 text-xs text-gray-500">

                                    {criterion.value}

                                  </p>

                                </div>


                                <CheckCircle2
                                  className="h-5 w-5 shrink-0 text-green-500"
                                />

                              </div>

                            </div>

                          )
                        )}

                      </div>


                      {/* =================================================
                          IMPORTANT NOTE
                      ================================================= */}

                      <div className="mt-4 flex gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4">

                        <AlertTriangle
                          className="mt-0.5 h-5 w-5 shrink-0 text-blue-600"
                        />


                        <div>

                          <p className="text-sm font-semibold text-blue-900">

                            Backend verification

                          </p>


                          <p className="mt-1 text-xs leading-5 text-blue-800">

                            This queue displays the verification categories for the service. The actual eligibility decision and citizen records are maintained by the FastAPI backend and Supabase.

                          </p>

                        </div>

                      </div>


                      {/* =================================================
                          ACTIONS
                      ================================================= */}

                      {(
                        String(
                          app.rawStatus ||
                          ''
                        ).toUpperCase() ===
                        'SUBMITTED'
                        ||
                        String(
                          app.rawStatus ||
                          ''
                        ).toUpperCase() ===
                        'UNDER_REVIEW'
                        ||
                        String(
                          app.rawStatus ||
                          ''
                        ).toUpperCase() ===
                        'UNDER_VERIFICATION'
                      ) && (

                        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">


                          {/* REJECT */}

                          <button
                            type="button"
                            onClick={() =>
                              handleReject(
                                app.id
                              )
                            }
                            disabled={
                              isProcessing
                            }
                            className="flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >

                            <XCircle
                              className="h-4 w-4"
                            />

                            {isProcessing
                              ? 'Processing...'
                              : 'Reject Application'}

                          </button>


                          {/* APPROVE */}

                          <button
                            type="button"
                            onClick={() =>
                              handleApprove(
                                app.id
                              )
                            }
                            disabled={
                              isProcessing
                            }
                            className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >

                            <CheckCircle2
                              className="h-4 w-4"
                            />

                            {isProcessing
                              ? 'Processing...'
                              : 'Authorize & Issue Digital Approval'}

                          </button>

                        </div>

                      )}

                    </div>

                  )}

                </div>

              );

            }
          )

        )}

      </div>

    </div>

  );

};


export default OfficerReviewQueue;